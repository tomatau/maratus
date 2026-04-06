package project

import (
	"reflect"
	"testing"
)

func TestResolvePackageInstallCommand(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name           string
		packageManager PackageManager
		packages       []string
		expected       []string
	}{
		{
			name:           "bun",
			packageManager: PackageManagerBun,
			packages:       []string{"@maratus-registry/button@0.2.0"},
			expected: []string{
				"bun",
				"add",
				"--no-save",
				"@maratus-registry/button@0.2.0",
			},
		},
		{
			name:           "pnpm",
			packageManager: PackageManagerPnpm,
			packages:       []string{"@maratus-registry/button@0.2.0"},
			expected: []string{
				"pnpm",
				"add",
				"--no-lockfile",
				"@maratus-registry/button@0.2.0",
			},
		},
		{
			name:           "npm",
			packageManager: PackageManagerNpm,
			packages:       []string{"@maratus-registry/button@0.2.0"},
			expected: []string{
				"npm",
				"install",
				"--no-save",
				"--no-package-lock",
				"@maratus-registry/button@0.2.0",
			},
		},
		{
			name:           "yarn",
			packageManager: PackageManagerYarn,
			packages:       []string{"@maratus-registry/button@0.2.0"},
			expected: []string{
				"yarn",
				"add",
				"--no-lockfile",
				"@maratus-registry/button@0.2.0",
			},
		},
		{
			name:           "deno",
			packageManager: PackageManagerDeno,
			packages:       []string{"@maratus-registry/button@0.2.0"},
			expected: []string{
				"deno",
				"add",
				"--no-lock",
				"npm:@maratus-registry/button@0.2.0",
			},
		},
	}

	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()

			actual, err := ResolvePackageInstallCommand(
				test.packageManager,
				test.packages,
			)
			if err != nil {
				t.Fatalf("ResolvePackageInstallCommand() error = %v", err)
			}

			if !reflect.DeepEqual(actual, test.expected) {
				t.Fatalf("ResolvePackageInstallCommand() = %#v, want %#v", actual, test.expected)
			}
		})
	}
}

func TestResolvePackageInstallCommandRequiresPackages(t *testing.T) {
	t.Parallel()

	_, err := ResolvePackageInstallCommand(PackageManagerNpm, nil)
	if err == nil {
		t.Fatal("expected error for empty package list")
	}
}

func TestInstallPackagesUsesExecutor(t *testing.T) {
	t.Parallel()

	previous := packageInstallExecutor
	t.Cleanup(func() {
		packageInstallExecutor = previous
	})

	var actualRootDir string
	var actualCommand []string
	packageInstallExecutor = func(rootDir string, commandArgs []string) error {
		actualRootDir = rootDir
		actualCommand = append([]string(nil), commandArgs...)
		return nil
	}

	err := InstallPackages(
		"/tmp/project",
		PackageManagerNpm,
		[]string{"@maratus-registry/button@0.2.0"},
	)
	if err != nil {
		t.Fatalf("InstallPackages() error = %v", err)
	}

	if actualRootDir != "/tmp/project" {
		t.Fatalf("InstallPackages() rootDir = %q, want %q", actualRootDir, "/tmp/project")
	}

	expectedCommand := []string{
		"npm",
		"install",
		"--no-save",
		"--no-package-lock",
		"@maratus-registry/button@0.2.0",
	}
	if !reflect.DeepEqual(actualCommand, expectedCommand) {
		t.Fatalf("InstallPackages() command = %#v, want %#v", actualCommand, expectedCommand)
	}
}
