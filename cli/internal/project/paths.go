package project

import (
	"arachne/cli/internal/config"
	"path/filepath"
)

func ResolveComponentDir(proj Project, componentName string) string {
	componentDir := proj.ComponentsDir
	if proj.Config.ComponentsLayout == config.ComponentsLayoutNested {
		return filepath.Join(componentDir, componentName)
	}

	return componentDir
}
