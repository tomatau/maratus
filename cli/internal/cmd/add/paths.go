package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"path/filepath"
	"strings"
)

func ComponentSourceFileName(proj project.Project, componentName string) string {
	if componentName == "" {
		return ".tsx"
	}
	if proj.Config.FileNames.Components == config.FileNameKindKebabCase {
		return componentName + ".tsx"
	}
	return componentExportName(componentName) + ".tsx"
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
	componentFileName := ComponentSourceFileName(proj, componentName)
	return InstallPaths{
		ComponentDir:  componentDir,
		ComponentFile: filepath.Join(componentDir, componentFileName),
		CSSFile:       filepath.Join(componentDir, ComponentStyleFileName(componentName, style)),
	}
}

func componentExportName(componentName string) string {
	if componentName == "" {
		return ""
	}

	parts := strings.Split(componentName, "-")
	var builder strings.Builder
	for _, part := range parts {
		if part == "" {
			continue
		}

		builder.WriteString(strings.ToUpper(part[:1]))
		if len(part) > 1 {
			builder.WriteString(part[1:])
		}
	}

	return builder.String()
}
