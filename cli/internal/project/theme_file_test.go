package project

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"arachne/cli/internal/config"
	"arachne/cli/internal/registry"
)

func TestUpdateTailwindThemeFileCreatesThemeFile(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "arachne.json")
	cfg := config.Config{
		SrcDir:        "app",
		ThemeDir:      "styles",
		ComponentsDir: "components",
	}
	manifest := ComponentsManifest{
		Version: 1,
		Components: map[string]InstalledComponent{
			"separator": {
				ThemeTokens: []string{
					"--color-border-subtle",
					"--spacing-1",
				},
			},
		},
	}

	path, created, err := UpdateTailwindThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateTailwindThemeFile returned error: %v", err)
	}
	if !created {
		t.Fatalf("expected created=true")
	}

	expectedPath := filepath.Join(tempDir, "app", "styles", ThemeFileName)
	if path != expectedPath {
		t.Fatalf("expected path %q, got %q", expectedPath, path)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile returned error: %v", err)
	}
	content := string(data)

	if !strings.Contains(content, "@theme inline {") {
		t.Fatalf("expected @theme inline block, got:\n%s", content)
	}
	if !strings.Contains(content, "Arachne theme tokens for installed components.") {
		t.Fatalf("expected explanatory comment block, got:\n%s", content)
	}
	if !strings.Contains(content, "--color-border-subtle: initial;") {
		t.Fatalf("expected token declaration, got:\n%s", content)
	}
	if !strings.Contains(content, "--spacing-1: initial;") {
		t.Fatalf("expected token declaration, got:\n%s", content)
	}
}

func TestUpdateTailwindThemeFilePreservesExistingValuesAndAddsMissingTokens(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "arachne.json")
	cfg := config.Config{
		SrcDir:        "app",
		ThemeDir:      "styles",
		ComponentsDir: "components",
	}
	manifest := ComponentsManifest{
		Version: 1,
		Components: map[string]InstalledComponent{
			"separator": {
				ThemeTokens: []string{
					"--color-border-subtle",
					"--spacing-1",
					"--shadow-focus-ring",
				},
				ComponentTokens: []registry.ComponentTokenMapping{
					{Component: "--ara-separator-color", Theme: "--color-border-subtle"},
				},
			},
		},
	}

	path := ThemeFilePath(configPath, cfg)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("MkdirAll returned error: %v", err)
	}
	initial := `/*
Arachne theme tokens for installed components.

Import this file from your stylesheet entrypoint so the tokens are included in your build.

Constraints:
- Keep this file to a single @theme inline block.
- Tokens left as initial are excluded from the final CSS output.
*/
@theme inline {
  --color-border-subtle: blue;
  --spacing-1: 1rem;
}
`
	if err := os.WriteFile(path, []byte(initial), 0o644); err != nil {
		t.Fatalf("WriteFile returned error: %v", err)
	}

	returnedPath, created, err := UpdateTailwindThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateTailwindThemeFile returned error: %v", err)
	}
	if created {
		t.Fatalf("expected created=false")
	}
	if returnedPath != path {
		t.Fatalf("expected path %q, got %q", path, returnedPath)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile returned error: %v", err)
	}
	content := string(data)

	if !strings.Contains(content, "--color-border-subtle: blue;") {
		t.Fatalf("expected existing value to be preserved, got:\n%s", content)
	}
	if !strings.Contains(content, "--spacing-1: 1rem;") {
		t.Fatalf("expected existing value to be preserved, got:\n%s", content)
	}
	if !strings.Contains(content, "--shadow-focus-ring: initial;") {
		t.Fatalf("expected missing token to be added, got:\n%s", content)
	}
}
