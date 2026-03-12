package project

import (
	"arachne/cli/internal/config"
	"os"
	"path/filepath"
	"strings"
)

func ResolveComponentsDir(cfg config.Config) string {
	componentsDir := filepath.Clean(cfg.ComponentsDir)
	if filepath.IsAbs(componentsDir) {
		return componentsDir
	}

	srcDir := filepath.Clean(cfg.SrcDir)
	if srcDir == "" || srcDir == "." {
		return componentsDir
	}

	prefix := srcDir + string(os.PathSeparator)
	if componentsDir == srcDir || strings.HasPrefix(componentsDir, prefix) {
		return componentsDir
	}

	return filepath.Join(srcDir, componentsDir)
}
