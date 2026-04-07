package project

import (
	"fmt"
	"maratus/cli/internal/debug"
	"os/exec"
	"strings"
)

type PackageInstallExecutor func(
	rootDir string,
	commandArgs []string,
) error

var packageInstallExecutor PackageInstallExecutor = runPackageInstallCommand

func SetPackageInstallExecutorForTesting(
	executor PackageInstallExecutor,
) func() {
	previous := packageInstallExecutor
	packageInstallExecutor = executor

	return func() {
		packageInstallExecutor = previous
	}
}

func ResolvePackageInstallCommand(
	packageManager PackageManager,
	packages []string,
) ([]string, error) {
	if len(packages) == 0 {
		return nil, fmt.Errorf("expected at least one package to install")
	}

	switch packageManager {
	case PackageManagerBun:
		return append(
			[]string{"bun", "add", "--no-save"},
			packages...,
		), nil
	case PackageManagerPnpm:
		return append(
			[]string{"pnpm", "add", "--no-lockfile"},
			packages...,
		), nil
	case PackageManagerNpm:
		return append(
			[]string{"npm", "install", "--no-save", "--no-package-lock"},
			packages...,
		), nil
	case PackageManagerYarn:
		return append(
			[]string{"yarn", "add", "--no-lockfile"},
			packages...,
		), nil
	case PackageManagerDeno:
		command := []string{"deno", "add", "--no-lock"}
		for _, packageName := range packages {
			command = append(command, "npm:"+packageName)
		}
		return command, nil
	default:
		return nil, fmt.Errorf("unsupported package manager: %s", packageManager)
	}
}

func InstallPackages(rootDir string, packageManager PackageManager, packages []string) error {
	commandArgs, err := ResolvePackageInstallCommand(packageManager, packages)
	if err != nil {
		return err
	}

	return packageInstallExecutor(rootDir, commandArgs)
}

func runPackageInstallCommand(rootDir string, commandArgs []string) error {
	debug.Logf(
		"install packages in %s: %s",
		rootDir,
		strings.Join(commandArgs, " "),
	)

	command := exec.Command(commandArgs[0], commandArgs[1:]...)
	command.Dir = rootDir

	output, err := command.CombinedOutput()
	if err != nil {
		return fmt.Errorf("install packages: %w: %s", err, output)
	}

	debug.Logf("install packages succeeded")

	return nil
}
