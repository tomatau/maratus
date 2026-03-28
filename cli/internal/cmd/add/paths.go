package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"path/filepath"
)

func ComponentSourceFileName(proj project.Project, componentName string) string {
	if componentName == "" {
		return ".tsx"
	}
	if proj.Config.FileNames.Components == config.FileNameKindKebabCase {
		return componentName + ".tsx"
	}
	return project.ComponentExportName(componentName) + ".tsx"
}

type InstallPaths struct {
	ComponentDir  string
	ComponentFile string
	CSSFile       string
}

func ComponentStyleFileName(proj project.Project, componentName string, style config.Style) string {
	baseName := componentName
	if proj.Config.FileNames.Components == config.FileNameKindMatchExport {
		baseName = project.ComponentExportName(componentName)
	}

	if style == config.StyleCSSModules {
		return baseName + ".module.css"
	}

	return baseName + ".css"
}

func ResolveInstallPaths(proj project.Project, componentName string, style config.Style) InstallPaths {
	componentDir := project.ResolveComponentDir(proj, componentName)
	componentFileName := ComponentSourceFileName(proj, componentName)
	return InstallPaths{
		ComponentDir:  componentDir,
		ComponentFile: filepath.Join(componentDir, componentFileName),
		CSSFile:       filepath.Join(componentDir, ComponentStyleFileName(proj, componentName, style)),
	}
}
