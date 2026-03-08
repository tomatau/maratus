package cmd

import (
	"bytes"
	"regexp"
	"testing"
)

func TestRootPrintsHelp(t *testing.T) {
	root := NewRootCmd()
	stdout := &bytes.Buffer{}
	stderr := &bytes.Buffer{}

	root.SetOut(stdout)
	root.SetErr(stderr)
	root.SetArgs([]string{})

	if err := root.Execute(); err != nil {
		t.Fatalf("execute root command: %v", err)
	}

	expected := "Arachne CLI tool for installing accessible React components\n\n" +
		"Usage: arachne [command] [...flags] [...args]\n\n" +
		"Commands:\n" +
		"  hello        Say \"Hello, world!\"\n"

	actual := stripANSI(stdout.String())
	if actual != expected {
		t.Fatalf("expected %q, got %q", expected, actual)
	}
}

func stripANSI(s string) string {
	ansi := regexp.MustCompile("\x1b\\[[0-9;]*m")
	return ansi.ReplaceAllString(s, "")
}
