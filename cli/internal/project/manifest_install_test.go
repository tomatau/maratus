package project

import (
	"path/filepath"
	"reflect"
	"testing"
)

func TestEnsureConsumerManifestInstallsManifestWhenMissing(t *testing.T) {
	rootDir := t.TempDir()
	proj := Project{
		RootDir:              rootDir,
		PackageManager:       PackageManagerNpm,
		RegistryManifestPath: filepath.Join(rootDir, "node_modules", "@maratus", "manifest", "dist", "index.json"),
		IsMaratusRepo:        false,
	}

	var actualRootDir string
	var actualCommand []string
	restore := SetPackageInstallExecutorForTesting(
		func(rootDir string, commandArgs []string) error {
			actualRootDir = rootDir
			actualCommand = append([]string(nil), commandArgs...)
			return nil
		},
	)
	t.Cleanup(restore)

	if err := EnsureConsumerManifest(proj); err != nil {
		t.Fatalf("EnsureConsumerManifest returned error: %v", err)
	}

	if actualRootDir != rootDir {
		t.Fatalf("install rootDir = %q, want %q", actualRootDir, rootDir)
	}

	expectedCommand := []string{
		"npm",
		"install",
		"@maratus/manifest",
	}
	if !reflect.DeepEqual(actualCommand, expectedCommand) {
		t.Fatalf("install command = %#v, want %#v", actualCommand, expectedCommand)
	}
}
