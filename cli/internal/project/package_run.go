package project

import (
	"fmt"
	"os"
	"path/filepath"
	"runtime"
)

type PackageRunCommand struct {
	Args []string
	Dir  string
}

func ResolvePackageRunCommand(
	packageManager PackageManager,
	packageName string,
	binaryName string,
	args []string,
) ([]string, error) {
	switch packageManager {
	case PackageManagerBun:
		return append([]string{"bun", "x", packageName}, args...), nil
	case PackageManagerPnpm:
		return append([]string{"pnpm", "exec", binaryName}, args...), nil
	case PackageManagerNpm:
		return append([]string{"npm", "exec", "--package", packageName, binaryName}, args...), nil
	case PackageManagerYarn:
		return append([]string{"yarn", binaryName}, args...), nil
	case PackageManagerDeno:
		return nil, fmt.Errorf("unsupported package manager: %s", packageManager)
	default:
		return nil, fmt.Errorf("unsupported package manager: %s", packageManager)
	}
}

func ResolveProjectPackageRunCommand(
	proj Project,
	packageName string,
	binaryName string,
	args []string,
) (PackageRunCommand, error) {
	rootDir := proj.RootDir
	if proj.IsMaratusRepo {
		repoRoot, err := resolveMaratusRepoRoot()
		if err != nil {
			return PackageRunCommand{}, err
		}
		rootDir = repoRoot
	}

	binaryPath := filepath.Join(rootDir, nodeModulesDirName, ".bin", binaryName)
	if runtime.GOOS == "windows" {
		binaryPath += ".cmd"
	}

	return PackageRunCommand{
		Args: append([]string{binaryPath}, args...),
		Dir:  rootDir,
	}, nil
}

func resolveMaratusRepoRoot() (string, error) {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		return "", fmt.Errorf("resolve maratus repo root: caller unavailable")
	}

	current := filepath.Clean(filepath.Dir(file))
	for {
		repoConfigPath := filepath.Join(current, repoConfigFileName)
		if _, err := os.Stat(repoConfigPath); err == nil {
			return current, nil
		}

		parent := filepath.Dir(current)
		if parent == current {
			break
		}

		current = parent
	}

	return "", fmt.Errorf("resolve maratus repo root: %s not found", repoConfigFileName)
}
