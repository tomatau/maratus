package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"path/filepath"
	"strings"
)

func ComponentSourceFileName(componentName string) string {
	if componentName == "" {
		return ".tsx"
	}
	return strings.ToUpper(componentName[:1]) + componentName[1:] + ".tsx"
}

type InstallPaths struct {
	ComponentDir  string
	ComponentFile string
	CSSFile       string
}

func ComponentStyleFileName(componentName string, style config.Style) string {
	if style == config.StyleCSSModules {
		return componentName + ".module.css"
	}

	return componentName + ".css"
}

func ResolveInstallPaths(proj project.Project, componentName string, style config.Style) InstallPaths {
	componentDir := project.ResolveComponentDir(proj, componentName)
	componentFileName := ComponentSourceFileName(componentName)
	return InstallPaths{
		ComponentDir:  componentDir,
		ComponentFile: filepath.Join(componentDir, componentFileName),
		CSSFile:       filepath.Join(componentDir, ComponentStyleFileName(componentName, style)),
	}
}
