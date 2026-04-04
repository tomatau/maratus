package project

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"maratus/cli/internal/config"
	"maratus/cli/internal/registry"
)

func TestUpdateThemeFileCreatesTailwindThemeFile(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "maratus.json")
	cfg := config.Config{
		SrcDir:        "app",
		ThemeDir:      "styles",
		ComponentsDir: "components",
		Style:         config.StyleTailwindCSS,
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

	path, created, err := UpdateThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateThemeFile returned error: %v", err)
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
	if !strings.Contains(content, "Maratus theme tokens for installed components.") {
		t.Fatalf("expected explanatory comment block, got:\n%s", content)
	}
	if !strings.Contains(content, "Import this file into your stylesheet entrypoint so the tokens are included in your build.") {
		t.Fatalf("expected import guidance, got:\n%s", content)
	}
	if !strings.Contains(content, "- Keep this file to a single @theme inline block.") {
		t.Fatalf("expected wrapper guidance, got:\n%s", content)
	}
	if !strings.Contains(content, "- Replace initial values with theme values for your project.") {
		t.Fatalf("expected value guidance, got:\n%s", content)
	}
	if !strings.Contains(content, "--color-border-subtle: initial;") {
		t.Fatalf("expected token declaration, got:\n%s", content)
	}
	if !strings.Contains(content, "--spacing-1: initial;") {
		t.Fatalf("expected token declaration, got:\n%s", content)
	}
}

func TestUpdateThemeFilePreservesExistingValuesAndAddsMissingTokens(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "maratus.json")
	cfg := config.Config{
		SrcDir:        "app",
		ThemeDir:      "styles",
		ComponentsDir: "components",
		Style:         config.StyleTailwindCSS,
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
Maratus theme tokens for installed components.

Import this file into your stylesheet entrypoint so the tokens are included in your build.

Constraints:
- Keep this file to a single @theme inline block.
- Replace initial values with theme values for your project.
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

	returnedPath, created, err := UpdateThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateThemeFile returned error: %v", err)
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

func TestUpdateThemeFileCreatesCSSFilesThemeFile(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "maratus.json")
	cfg := config.Config{
		SrcDir:        "src",
		ThemeDir:      "styles",
		ComponentsDir: "components",
		Style:         config.StyleCSSFiles,
	}
	manifest := ComponentsManifest{
		Version: 1,
		Components: map[string]InstalledComponent{
			"separator": {
				ThemeTokens: []string{
					"--ara-border-width-x1",
					"--ara-color-border-subtle",
					"--ara-spacing-x1",
				},
			},
		},
	}

	path, created, err := UpdateThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateThemeFile returned error: %v", err)
	}
	if !created {
		t.Fatalf("expected created=true")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile returned error: %v", err)
	}
	content := string(data)

	if !strings.Contains(content, "@layer theme {\n  :root {\n") {
		t.Fatalf("expected css-files wrapper, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-border-width-x1: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-color-border-subtle: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-spacing-x1: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "- Keep this file to a single @layer theme { :root { ... } } block.") {
		t.Fatalf("expected css-files constraint guidance, got:\n%s", content)
	}
}

func TestUpdateThemeFileCreatesCSSModulesThemeFile(t *testing.T) {
	t.Parallel()

	tempDir := t.TempDir()
	configPath := filepath.Join(tempDir, "maratus.json")
	cfg := config.Config{
		SrcDir:        "src",
		ThemeDir:      "styles",
		ComponentsDir: "components",
		Style:         config.StyleCSSModules,
	}
	manifest := ComponentsManifest{
		Version: 1,
		Components: map[string]InstalledComponent{
			"separator": {
				ThemeTokens: []string{
					"--ara-border-width-x1",
					"--ara-color-border-subtle",
					"--ara-spacing-x1",
				},
			},
		},
	}

	path, created, err := UpdateThemeFile(configPath, cfg, manifest)
	if err != nil {
		t.Fatalf("UpdateThemeFile returned error: %v", err)
	}
	if !created {
		t.Fatalf("expected created=true")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile returned error: %v", err)
	}
	content := string(data)

	if !strings.Contains(content, "@layer theme {\n  :root {\n") {
		t.Fatalf("expected css-modules wrapper, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-border-width-x1: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-color-border-subtle: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "    --ara-spacing-x1: initial;") {
		t.Fatalf("expected nested declaration indentation, got:\n%s", content)
	}
	if !strings.Contains(content, "- Keep this file to a single @layer theme { :root { ... } } block.") {
		t.Fatalf("expected css-modules constraint guidance, got:\n%s", content)
	}
}
