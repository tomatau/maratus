package project

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
)

type fileSnapshot struct {
	path         string
	exists       bool
	snapshotPath string
}

type ConsumerPackageCleanup struct {
	files []fileSnapshot
}

func BeginConsumerPackageCleanup(proj Project) (ConsumerPackageCleanup, error) {
	if proj.IsMaratusRepo {
		return ConsumerPackageCleanup{}, nil
	}

	paths := []string{
		filepath.Join(proj.RootDir, "package.json"),
	}

	if lockfileName := resolvePackageManagerLockfile(proj.PackageManager); lockfileName != "" {
		paths = append(paths, filepath.Join(proj.RootDir, lockfileName))
	}

	snapshots := make([]fileSnapshot, 0, len(paths))
	for _, path := range paths {
		snapshot, err := createFileSnapshot(path)
		if err != nil {
			return ConsumerPackageCleanup{}, err
		}
		snapshots = append(snapshots, snapshot)
	}

	return ConsumerPackageCleanup{files: snapshots}, nil
}

func (c ConsumerPackageCleanup) Restore() error {
	for _, snapshot := range c.files {
		if snapshot.snapshotPath == "" {
			continue
		}
		defer os.Remove(snapshot.snapshotPath)
	}

	for _, snapshot := range c.files {
		if snapshot.exists {
			if err := restoreSnapshotFile(snapshot.path, snapshot.snapshotPath); err != nil {
				return fmt.Errorf("restore %s: %w", snapshot.path, err)
			}
			continue
		}

		if err := os.Remove(snapshot.path); err != nil && !os.IsNotExist(err) {
			return fmt.Errorf("remove %s: %w", snapshot.path, err)
		}
	}

	return nil
}

func createFileSnapshot(path string) (fileSnapshot, error) {
	sourceFile, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			return fileSnapshot{path: path}, nil
		}
		return fileSnapshot{}, fmt.Errorf("open %s: %w", path, err)
	}
	defer sourceFile.Close()

	snapshotFile, err := os.CreateTemp("", "maratus-package-cleanup-*")
	if err != nil {
		return fileSnapshot{}, fmt.Errorf("create snapshot for %s: %w", path, err)
	}
	defer snapshotFile.Close()

	if _, err := io.Copy(snapshotFile, sourceFile); err != nil {
		return fileSnapshot{}, fmt.Errorf("snapshot %s: %w", path, err)
	}

	return fileSnapshot{
		path:         path,
		exists:       true,
		snapshotPath: snapshotFile.Name(),
	}, nil
}

func restoreSnapshotFile(path string, snapshotPath string) error {
	sourceFile, err := os.Open(snapshotPath)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	targetFile, err := os.Create(path)
	if err != nil {
		return err
	}
	defer targetFile.Close()

	if _, err := io.Copy(targetFile, sourceFile); err != nil {
		return err
	}

	return nil
}

func resolvePackageManagerLockfile(packageManager PackageManager) string {
	switch packageManager {
	case PackageManagerBun:
		return string(PackageManagerLockfileBun)
	case PackageManagerPnpm:
		return string(PackageManagerLockfilePnpm)
	case PackageManagerNpm:
		return string(PackageManagerLockfileNpm)
	case PackageManagerYarn:
		return string(PackageManagerLockfileYarn)
	case PackageManagerDeno:
		return string(PackageManagerLockfileDeno)
	default:
		return ""
	}
}
