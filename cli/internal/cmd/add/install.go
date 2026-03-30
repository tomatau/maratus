package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/fsutil"
	"arachne/cli/internal/project"
	"arachne/cli/internal/registry"
	"arachne/cli/internal/source"
	"os"
	"path/filepath"
)

type InstallResult struct {
	Component    string
	InstalledAs  string
	Files        []string
	Dependencies []string
}

type DependencyInstallResult struct {
	Package string
	Files   []string
}

func InstallComponent(proj project.Project, componentName string, style config.Style) (InstallResult, error) {
	setup, err := resolveComponentInstall(proj, componentName, style)
	if err != nil {
		return InstallResult{}, err
	}

	return installBuiltSourceGraph(
		proj,
		setup.Result,
		setup.SourceBaseDir,
		setup.InstallPaths,
	)
}

func installBuiltSourceGraph(
	proj project.Project,
	result InstallResult,
	sourceBaseDir string,
	installPaths InstallPaths,
) (InstallResult, error) {
	sourceGraph, err := fsutil.CollectRelativeSourceGraph(sourceBaseDir)
	if err != nil {
		return InstallResult{}, err
	}
	prepared, err := prepareInstallFiles(
		sourceBaseDir,
		installPaths.ComponentDir,
		func(relativePath string) bool {
			return source.IsBarrelFile(relativePath) && !shouldKeepComponentBarrel(proj)
		},
		func(relativePath string, sourceText string) string {
			return RewriteInstalledComponentRelativePath(
				proj,
				result.Component,
				relativePath,
				sourceText,
			)
		},
	)
	if err != nil {
		return InstallResult{}, err
	}
	files, err := fsutil.InstallPreparedSourceFiles(
		fsutil.PreparedSourceFiles{
			Files:            prepared.Files,
			RewriteablePaths: prepared.RewriteablePaths,
		},
		func(relativePath string) string {
			return filepath.Join(
				installPaths.ComponentDir,
				RewriteInstalledComponentRelativePath(
					proj,
					result.Component,
					relativePath,
					prepared.SourceTextByPath[filepath.ToSlash(relativePath)],
				),
			)
		},
		func() (map[string]string, error) {
			return rewriteComponentSources(
				proj,
				result.Component,
				installPaths.ComponentDir,
				result.Dependencies,
				sourceGraph,
				prepared.SourceTextByPath,
				prepared.RewriteablePaths,
			)
		},
	)
	if err != nil {
		return InstallResult{}, err
	}

	result.Files = append(result.Files, files...)
	return result, nil
}

func shouldKeepComponentBarrel(proj project.Project) bool {
	return proj.Config.Layout.Kind == config.LayoutKindNested && proj.Config.Layout.Barrel
}

func InstallDependencies(
	proj project.Project,
	packageNames []string,
) ([]DependencyInstallResult, error) {
	if len(packageNames) == 0 {
		return nil, nil
	}

	pending := registry.DedupePackageNames(packageNames)
	installed := make(map[string]struct{}, len(pending))
	results := make([]DependencyInstallResult, 0, len(pending))

	for len(pending) > 0 {
		packageName := pending[0]
		pending = pending[1:]
		if _, ok := installed[packageName]; ok {
			continue
		}

		sourceBaseDir, err := source.ResolveExistingPackageSourceDir(
			filepath.Join(proj.RootDir, "lib"),
			packageName,
		)
		if err != nil {
			return nil, err
		}

		destinationDir := project.ResolveLibPackageDir(proj, packageName)
		if err := os.MkdirAll(destinationDir, 0o755); err != nil {
			return nil, err
		}

		installedFiles, err := installDependencySourceGraph(
			proj,
			sourceBaseDir,
			destinationDir,
		)
		if err != nil {
			return nil, err
		}
		internalDeps, err := registry.LoadInternalDependencies(
			filepath.Join(proj.RootDir, "lib", packageName),
		)
		if err != nil {
			return nil, err
		}

		installed[packageName] = struct{}{}
		results = append(results, DependencyInstallResult{
			Package: packageName,
			Files:   installedFiles,
		})
		for _, dependencyName := range internalDeps {
			if _, ok := installed[dependencyName]; ok {
				continue
			}
			pending = append(pending, dependencyName)
		}
	}

	return results, nil
}

func installDependencySourceGraph(
	proj project.Project,
	sourceBaseDir string,
	destinationDir string,
) ([]string, error) {
	sourceGraph, err := fsutil.CollectRelativeSourceGraph(sourceBaseDir)
	if err != nil {
		return nil, err
	}
	packageName := filepath.Base(filepath.Dir(sourceBaseDir))
	internalDeps, err := registry.LoadInternalDependencies(
		filepath.Join(proj.RootDir, "lib", packageName),
	)
	if err != nil {
		return nil, err
	}
	prepared, err := prepareInstallFiles(
		sourceBaseDir,
		destinationDir,
		func(relativePath string) bool {
			if source.IsTestFile(relativePath) {
				return true
			}
			return source.IsBarrelFile(relativePath) && !proj.Config.Layout.Barrel
		},
		func(relativePath string, _ string) string {
			return project.RewriteLibRelativePath(
				relativePath,
				proj.Config.FileNames.Lib,
			)
		},
	)
	if err != nil {
		return nil, err
	}

	return fsutil.InstallPreparedSourceFiles(
		fsutil.PreparedSourceFiles{
			Files:            prepared.Files,
			RewriteablePaths: prepared.RewriteablePaths,
		},
		func(relativePath string) string {
			return filepath.Join(
				destinationDir,
				project.RewriteLibRelativePath(
					relativePath,
					proj.Config.FileNames.Lib,
				),
			)
		},
		func() (map[string]string, error) {
			return rewriteLibSources(
				proj,
				destinationDir,
				internalDeps,
				sourceGraph,
				prepared.SourceTextByPath,
				prepared.RewriteablePaths,
			)
		},
	)
}
