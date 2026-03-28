package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestLoadRejectsInvalidLayoutKind(t *testing.T) {
	path := writeConfigFixture(t, `{
  "srcDir": "src",
  "componentsDir": "components",
  "layout": {
    "kind": "sideways"
  }
}`)

	_, err := Load(path)
	if err == nil {
		t.Fatal("expected invalid layout.kind to fail")
	}
	if !strings.Contains(err.Error(), "layout.kind") {
		t.Fatalf("expected layout.kind error, got: %v", err)
	}
}

func TestLoadRejectsInvalidLibFileNameKind(t *testing.T) {
	path := writeConfigFixture(t, `{
  "srcDir": "src",
  "componentsDir": "components",
  "filenames": {
    "lib": "snake-case"
  }
}`)

	_, err := Load(path)
	if err == nil {
		t.Fatal("expected invalid filenames.lib to fail")
	}
	if !strings.Contains(err.Error(), "filenames.lib") {
		t.Fatalf("expected filenames.lib error, got: %v", err)
	}
}

func TestLoadRejectsInvalidComponentsFileNameKind(t *testing.T) {
	path := writeConfigFixture(t, `{
  "srcDir": "src",
  "componentsDir": "components",
  "filenames": {
    "components": "snake-case"
  }
}`)

	_, err := Load(path)
	if err == nil {
		t.Fatal("expected invalid filenames.components to fail")
	}
	if !strings.Contains(err.Error(), "filenames.components") {
		t.Fatalf("expected filenames.components error, got: %v", err)
	}
}

func TestLoadRejectsInvalidStyle(t *testing.T) {
	path := writeConfigFixture(t, `{
  "srcDir": "src",
  "componentsDir": "components",
  "style": "scss"
}`)

	_, err := Load(path)
	if err == nil {
		t.Fatal("expected invalid style to fail")
	}
	if !strings.Contains(err.Error(), "style") {
		t.Fatalf("expected style error, got: %v", err)
	}
}

func writeConfigFixture(t *testing.T, contents string) string {
	t.Helper()

	dir := t.TempDir()
	path := filepath.Join(dir, "arachne.json")
	if err := os.WriteFile(path, []byte(contents), 0o644); err != nil {
		t.Fatalf("write config fixture: %v", err)
	}

	return path
}
