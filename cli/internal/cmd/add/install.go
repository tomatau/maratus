package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/fsutil"
	"arachne/cli/internal/project"
	"arachne/cli/internal/registry"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type InstallResult struct {
	Component string
	Files     []string
}

func InstallComponent(proj project.Project, componentName string, style string) (InstallResult, error) {
	result := InstallResult{Component: componentName}

	componentFileName := ComponentSourceFileName(componentName)
	sourceStyleDir, err := config.SourceStyleDirFor(style)
	if err != nil {
		return InstallResult{}, err
	}

	sourceBaseDir := filepath.Join(proj.RegistryRoot, componentName, sourceStyleDir)
	sourceComponentFile := filepath.Join(sourceBaseDir, componentFileName)
	if _, err := os.Stat(sourceComponentFile); err != nil {
		available, listErr := registry.AvailableComponents(proj.RegistryRoot)
		if listErr != nil {
			return InstallResult{}, fmt.Errorf("component %q not found (failed to list available components: %w)", componentName, listErr)
		}
		if os.IsNotExist(err) {
			return InstallResult{}, fmt.Errorf(
				"component %q not found. expected %s. available: %s",
				componentName,
				filepath.Join(registry.DefaultRootDir, componentName, sourceStyleDir, componentFileName),
				strings.Join(available, ", "),
			)
		}
		return InstallResult{}, err
	}

	installPaths := ResolveInstallPaths(proj, componentName)

	if err := os.MkdirAll(installPaths.ComponentDir, 0o755); err != nil {
		return InstallResult{}, err
	}

	switch style {
	case config.StyleCSSFiles:
		cssSourcePath := filepath.Join(sourceBaseDir, componentName+".css")
		if err := fsutil.CopyFile(sourceComponentFile, installPaths.ComponentFile); err != nil {
			return InstallResult{}, err
		}
		if err := fsutil.CopyFile(cssSourcePath, installPaths.CSSFile); err != nil {
			return InstallResult{}, err
		}
		result.Files = append(result.Files, installPaths.ComponentFile, installPaths.CSSFile)
	case config.StyleInlineCSSVars:
		if err := fsutil.CopyFile(sourceComponentFile, installPaths.ComponentFile); err != nil {
			return InstallResult{}, err
		}
		result.Files = append(result.Files, installPaths.ComponentFile)
	default:
		return InstallResult{}, fmt.Errorf("unsupported style: %s", style)
	}

	return result, nil
}
