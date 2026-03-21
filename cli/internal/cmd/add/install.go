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

func InstallComponent(proj project.Project, componentName string, style config.Style) (InstallResult, error) {
	result := InstallResult{Component: componentName}

	sourceStyleDir, err := config.SourceStyleDirFor(style)
	if err != nil {
		return InstallResult{}, err
	}

	sourceBaseDir := filepath.Join(proj.RegistryRoot, componentName, sourceStyleDir)
	if _, err := os.Stat(sourceBaseDir); err != nil {
		available, listErr := registry.AvailableComponents(proj.RegistryRoot)
		if listErr != nil {
			return InstallResult{}, fmt.Errorf("component %q not found (failed to list available components: %w)", componentName, listErr)
		}
		if os.IsNotExist(err) {
			return InstallResult{}, fmt.Errorf(
				"component %q not found. expected %s. available: %s",
				componentName,
				filepath.Join(registry.DefaultRootDir, componentName, sourceStyleDir),
				strings.Join(available, ", "),
			)
		}
		return InstallResult{}, err
	}

	installPaths := ResolveInstallPaths(proj, componentName, style)

	if err := os.MkdirAll(installPaths.ComponentDir, 0o755); err != nil {
		return InstallResult{}, err
	}

	return installBuiltSourceGraph(result, sourceBaseDir, installPaths)
}

func installBuiltSourceGraph(
	result InstallResult,
	sourceBaseDir string,
	installPaths InstallPaths,
) (InstallResult, error) {
	err := filepath.WalkDir(sourceBaseDir, func(sourcePath string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}

		relativePath, err := filepath.Rel(sourceBaseDir, sourcePath)
		if err != nil {
			return err
		}
		destinationPath := filepath.Join(installPaths.ComponentDir, relativePath)
		if err := os.MkdirAll(filepath.Dir(destinationPath), 0o755); err != nil {
			return err
		}
		if err := fsutil.CopyFile(sourcePath, destinationPath); err != nil {
			return err
		}
		result.Files = append(result.Files, destinationPath)
		return nil
	})
	if err != nil {
		return InstallResult{}, err
	}

	return result, nil
}
