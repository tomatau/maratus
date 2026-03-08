package cmd

import (
	"bytes"
	"os"
	"path/filepath"
	"testing"
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
