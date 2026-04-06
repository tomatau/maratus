package addcmd

import (
	"fmt"
	"maratus/cli/internal/config"
	"maratus/cli/internal/project"
	"maratus/cli/internal/registry"
	"os"
	"path/filepath"
	"strings"
)

type componentInstallSetup struct {
	Result        InstallResult
	SourceBaseDir string
	InstallPaths  InstallPaths
}

func resolveComponentInstall(
	proj project.Project,
	componentName string,
	style config.Style,
) (componentInstallSetup, error) {
	result := InstallResult{Component: componentName}

	sourceStyleDir, err := config.SourceStyleDirFor(style)
	if err != nil {
		return componentInstallSetup{}, err
	}

	sourceBaseDir := project.ResolveRegistryComponentSourceBaseDir(
		proj,
		componentName,
		sourceStyleDir,
	)
	if _, err := os.Stat(sourceBaseDir); err != nil {
		available, listErr := registry.AvailableComponents(proj.RegistryManifestPath)
		if listErr != nil {
			return componentInstallSetup{}, fmt.Errorf(
				"component %q not found (failed to list available components: %w)",
				componentName,
				listErr,
			)
		}
		if os.IsNotExist(err) {
			return componentInstallSetup{}, fmt.Errorf(
				"component %q not found. expected %s. available: %s",
				componentName,
				filepath.Join(registry.DefaultRootDir, componentName, sourceStyleDir),
				strings.Join(available, ", "),
			)
		}
		return componentInstallSetup{}, err
	}

	installPaths := ResolveInstallPaths(proj, componentName, style)
	result.InstalledAs = strings.TrimSuffix(
		filepath.Base(installPaths.ComponentFile),
		filepath.Ext(installPaths.ComponentFile),
	)

	if err := os.MkdirAll(installPaths.ComponentDir, 0o755); err != nil {
		return componentInstallSetup{}, err
	}

	result.Dependencies, err = registry.LoadComponentInternalDependencies(
		project.ResolveRegistryComponentPackageRoot(proj, componentName),
	)
	if err != nil {
		return componentInstallSetup{}, err
	}

	return componentInstallSetup{
		Result:        result,
		SourceBaseDir: sourceBaseDir,
		InstallPaths:  installPaths,
	}, nil
}
