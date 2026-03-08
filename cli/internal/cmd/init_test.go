package cmd

import (
	"bytes"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"testing"

	"arachne/cli/internal/cmd/initflow"
)

func TestInitCreatesArachneConfig(t *testing.T) {
	wd := t.TempDir()
	configPath := filepath.Join(wd, "arachne.json")

	root := NewRootCmd()
	root.SetArgs([]string{"init"})
	root.SetOut(&bytes.Buffer{})
	root.SetErr(&bytes.Buffer{})

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() {
		_ = os.Chdir(previous)
	})

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute init: %v", err)
	}

	if _, err := os.Stat(configPath); err != nil {
		t.Fatalf("expected arachne.json to exist: %v", err)
	}
}

func TestInitUsesDefaultSrcDirInNonInteractiveMode(t *testing.T) {
	wd := t.TempDir()
	configPath := filepath.Join(wd, "arachne.json")

	root := NewRootCmd()
	root.SetArgs([]string{"init"})

	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}
	root.SetOut(stdout)
	root.SetErr(stderr)

	previous, err := os.Getwd()
	if err != nil {
		t.Fatalf("getwd: %v", err)
	}
	t.Cleanup(func() {
		_ = os.Chdir(previous)
	})

	if err := os.Chdir(wd); err != nil {
		t.Fatalf("chdir temp dir: %v", err)
	}

	if err := root.Execute(); err != nil {
		t.Fatalf("execute init: %v", err)
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		t.Fatalf("read config: %v", err)
	}

	var cfg struct {
		SrcDir        string `json:"srcDir"`
		ComponentsDir string `json:"componentsDir"`
	}
	if err := json.Unmarshal(data, &cfg); err != nil {
		t.Fatalf("unmarshal config: %v", err)
	}
	if cfg.SrcDir != "src" {
		t.Fatalf("expected srcDir to default to src, got %q", cfg.SrcDir)
	}
	if cfg.ComponentsDir != "components" {
		t.Fatalf("expected componentsDir to default to components, got %q", cfg.ComponentsDir)
	}
}

func TestTopLevelDirsExcludesHiddenAndGitignored(t *testing.T) {
	wd := t.TempDir()
	for _, dir := range []string{"components", "packages", "tmp", ".cache"} {
		if err := os.Mkdir(filepath.Join(wd, dir), 0o755); err != nil {
			t.Fatalf("mkdir %s: %v", dir, err)
		}
	}
	if err := os.WriteFile(filepath.Join(wd, ".gitignore"), []byte("tmp/\n"), 0o644); err != nil {
		t.Fatalf("write .gitignore: %v", err)
	}
	if err := exec.Command("git", "-C", wd, "init").Run(); err != nil {
		t.Fatalf("git init: %v", err)
	}

	got, err := initflow.TopLevelDirs(wd)
	if err != nil {
		t.Fatalf("topLevelDirs: %v", err)
	}

	want := []string{"components", "packages"}

	if len(got) != len(want) {
		t.Fatalf("expected %v, got %v", want, got)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %v, got %v", want, got)
		}
	}
}
