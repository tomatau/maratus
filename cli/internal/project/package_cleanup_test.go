package project

import (
	"os"
	"path/filepath"
	"testing"
)

func TestConsumerPackageCleanupRestoresPackageFiles(t *testing.T) {
	rootDir := t.TempDir()
	packageJSONPath := filepath.Join(rootDir, "package.json")
	lockfilePath := filepath.Join(rootDir, string(PackageManagerLockfileNpm))

	if err := os.WriteFile(packageJSONPath, []byte("{\"name\":\"before\"}\n"), 0o644); err != nil {
		t.Fatalf("write package.json: %v", err)
	}
	if err := os.WriteFile(lockfilePath, []byte("{\"lockfileVersion\":3}\n"), 0o644); err != nil {
		t.Fatalf("write package-lock.json: %v", err)
	}

	cleanup, err := BeginConsumerPackageCleanup(Project{
		RootDir:        rootDir,
		PackageManager: PackageManagerNpm,
	})
	if err != nil {
		t.Fatalf("BeginConsumerPackageCleanup() error = %v", err)
	}

	if err := os.WriteFile(packageJSONPath, []byte("{\"name\":\"after\"}\n"), 0o644); err != nil {
		t.Fatalf("mutate package.json: %v", err)
	}
	if err := os.Remove(lockfilePath); err != nil {
		t.Fatalf("remove package-lock.json: %v", err)
	}

	if err := cleanup.Restore(); err != nil {
		t.Fatalf("Restore() error = %v", err)
	}

	packageJSONContents, err := os.ReadFile(packageJSONPath)
	if err != nil {
		t.Fatalf("read package.json: %v", err)
	}
	if string(packageJSONContents) != "{\"name\":\"before\"}\n" {
		t.Fatalf("package.json = %q, want %q", string(packageJSONContents), "{\"name\":\"before\"}\n")
	}

	lockfileContents, err := os.ReadFile(lockfilePath)
	if err != nil {
		t.Fatalf("read package-lock.json: %v", err)
	}
	if string(lockfileContents) != "{\"lockfileVersion\":3}\n" {
		t.Fatalf("package-lock.json = %q, want %q", string(lockfileContents), "{\"lockfileVersion\":3}\n")
	}
}

func TestConsumerPackageCleanupRemovesCreatedLockfile(t *testing.T) {
	rootDir := t.TempDir()
	packageJSONPath := filepath.Join(rootDir, "package.json")
	lockfilePath := filepath.Join(rootDir, string(PackageManagerLockfileNpm))

	if err := os.WriteFile(packageJSONPath, []byte("{\"name\":\"before\"}\n"), 0o644); err != nil {
		t.Fatalf("write package.json: %v", err)
	}

	cleanup, err := BeginConsumerPackageCleanup(Project{
		RootDir:        rootDir,
		PackageManager: PackageManagerNpm,
	})
	if err != nil {
		t.Fatalf("BeginConsumerPackageCleanup() error = %v", err)
	}

	if err := os.WriteFile(lockfilePath, []byte("{\"lockfileVersion\":3}\n"), 0o644); err != nil {
		t.Fatalf("create package-lock.json: %v", err)
	}

	if err := cleanup.Restore(); err != nil {
		t.Fatalf("Restore() error = %v", err)
	}

	if _, err := os.Stat(lockfilePath); !os.IsNotExist(err) {
		t.Fatalf("expected package-lock.json to be removed, got err=%v", err)
	}
}
