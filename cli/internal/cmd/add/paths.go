package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"path/filepath"
	"regexp"
)

func ComponentSourceFileName(proj project.Project, componentName string) string {
	if componentName == "" {
		return ".tsx"
	}
	if proj.Config.FileNames.Components == config.FileNameKindKebabCase {
		return componentName + ".tsx"
	}
	return project.ComponentMatchExportName(componentName) + ".tsx"
}

type InstallPaths struct {
	ComponentDir  string
	ComponentFile string
	CSSFile       string
}

func ComponentStyleFileName(proj project.Project, componentName string, style config.Style) string {
	baseName := componentName
	if proj.Config.FileNames.Components == config.FileNameKindMatchExport {
		baseName = project.ComponentMatchExportName(componentName)
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

func RewriteInstalledComponentRelativePath(
	proj project.Project,
	componentName string,
	relativePath string,
	sourceText string,
) string {
	if exportsHook(sourceText) {
		if proj.Config.FileNames.Hooks == config.FileNameKindKebabCase {
			return project.RewriteSourceRelativePath(relativePath)
		}
		return relativePath
	}

	return project.RewriteComponentRelativePath(
		relativePath,
		componentName,
		proj.Config.FileNames.Components,
	)
}

var hookExportPattern = regexp.MustCompile(
	`(?m)\bexport\s+(?:async\s+)?(?:function|const|let|var)\s+(use[A-Z0-9_]\w*)\b`,
)

func exportsHook(sourceText string) bool {
	return hookExportPattern.MatchString(sourceText)
}
