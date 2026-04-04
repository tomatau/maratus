package cmd

import (
	"bytes"
	"regexp"
	"strings"
	"testing"
)

func TestHelpPrintsHelp(t *testing.T) {
	root := NewRootCmd()
	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}

	root.SetOut(stdout)
	root.SetErr(stderr)
	root.SetArgs([]string{})

	if err := root.Execute(); err != nil {
		t.Fatalf("execute root command: %v", err)
	}

	actual := stripANSI(stdout.String())
	expectedParts := []string{
		"Maratus CLI tool for installing accessible React components",
		"Usage: maratus [command] [...flags] [...args]",
		"add                   Add a component",
		"init                  Initialize Maratus config",
		"--config-file",
		"Global Flags:",
		"Config file path (alias: -cf)",
		"(default \"maratus.json\")",
	}

	for _, part := range expectedParts {
		if !strings.Contains(actual, part) {
			t.Fatalf("expected help output to contain %q, got %q", part, actual)
		}
	}
}

func stripANSI(s string) string {
	ansi := regexp.MustCompile("\x1b\\[[0-9;]*m")
	return ansi.ReplaceAllString(s, "")
}
