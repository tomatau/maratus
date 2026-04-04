package project

import (
	"maratus/cli/internal/config"
	"testing"
)

func TestRewriteComponentRelativePathMatchExportRewritesRegistryStyleCSSNames(t *testing.T) {
	got := RewriteComponentRelativePath(
		"component-with-hook.css",
		"component-with-hook",
		config.FileNameKindMatchExport,
	)
	if got != "ComponentWithHook.css" {
		t.Fatalf("expected rewritten css path, got %q", got)
	}
}

func TestRewriteComponentRelativePathMatchExportRewritesRegistryStyleCSSModuleNames(t *testing.T) {
	got := RewriteComponentRelativePath(
		"component-with-hook.module.css",
		"component-with-hook",
		config.FileNameKindMatchExport,
	)
	if got != "ComponentWithHook.module.css" {
		t.Fatalf("expected rewritten css module path, got %q", got)
	}
}
