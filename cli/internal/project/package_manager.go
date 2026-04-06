package project

import (
	"os"
	"path/filepath"
)

type PackageManager string
type PackageManagerLockfile string

const (
	PackageManagerBun  PackageManager = "bun"
	PackageManagerPnpm PackageManager = "pnpm"
	PackageManagerNpm  PackageManager = "npm"
	PackageManagerYarn PackageManager = "yarn"
	PackageManagerDeno PackageManager = "deno"

	PackageManagerLockfileBun  PackageManagerLockfile = "bun.lock"
	PackageManagerLockfilePnpm PackageManagerLockfile = "pnpm-lock.yaml"
	PackageManagerLockfileNpm  PackageManagerLockfile = "package-lock.json"
	PackageManagerLockfileYarn PackageManagerLockfile = "yarn.lock"
	PackageManagerLockfileDeno PackageManagerLockfile = "deno.lock"
)

func DetectPackageManager(rootDir string) PackageManager {
	switch {
	case fileExists(filepath.Join(rootDir, string(PackageManagerLockfileBun))):
		return PackageManagerBun
	case fileExists(filepath.Join(rootDir, string(PackageManagerLockfilePnpm))):
		return PackageManagerPnpm
	case fileExists(filepath.Join(rootDir, string(PackageManagerLockfileNpm))):
		return PackageManagerNpm
	case fileExists(filepath.Join(rootDir, string(PackageManagerLockfileYarn))):
		return PackageManagerYarn
	case fileExists(filepath.Join(rootDir, string(PackageManagerLockfileDeno))):
		return PackageManagerDeno
	default:
		return PackageManagerNpm
	}
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
