package project

import (
	"reflect"
	"testing"
)

func TestResolvePackageRunCommand(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name           string
		packageManager PackageManager
		packageName    string
		args           []string
		expected       []string
	}{
		{
			name:           "bun",
			packageManager: PackageManagerBun,
			packageName:    "@maratus/codemod-runner",
			args:           []string{"manifest.json"},
			expected:       []string{"bun", "x", "@maratus/codemod-runner", "manifest.json"},
		},
		{
			name:           "pnpm",
			packageManager: PackageManagerPnpm,
			packageName:    "@maratus/codemod-runner",
			args:           []string{"manifest.json"},
			expected:       []string{"pnpm", "exec", "maratus-codemod-runner", "manifest.json"},
		},
		{
			name:           "npm",
			packageManager: PackageManagerNpm,
			packageName:    "@maratus/codemod-runner",
			args:           []string{"manifest.json"},
			expected:       []string{"npm", "exec", "--package", "@maratus/codemod-runner", "maratus-codemod-runner", "manifest.json"},
		},
		{
			name:           "yarn",
			packageManager: PackageManagerYarn,
			packageName:    "@maratus/codemod-runner",
			args:           []string{"manifest.json"},
			expected:       []string{"yarn", "maratus-codemod-runner", "manifest.json"},
		},
	}

	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()

			actual, err := ResolvePackageRunCommand(test.packageManager, test.packageName, "maratus-codemod-runner", test.args)
			if err != nil {
				t.Fatalf("ResolvePackageRunCommand() error = %v", err)
			}

			if !reflect.DeepEqual(actual, test.expected) {
				t.Fatalf("ResolvePackageRunCommand() = %#v, want %#v", actual, test.expected)
			}
		})
	}
}

func TestResolvePackageRunCommandRejectsUnsupportedPackageManager(t *testing.T) {
	t.Parallel()

	_, err := ResolvePackageRunCommand(PackageManagerDeno, "@maratus/codemod-runner", "maratus-codemod-runner", nil)
	if err == nil {
		t.Fatal("expected error for unsupported package manager")
	}
}
