package project

import "fmt"

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
