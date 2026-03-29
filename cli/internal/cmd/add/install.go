package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/fsutil"
	"arachne/cli/internal/project"
	"arachne/cli/internal/registry"
	"arachne/cli/internal/source"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
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
	result.InstalledAs = strings.TrimSuffix(
		filepath.Base(installPaths.ComponentFile),
		filepath.Ext(installPaths.ComponentFile),
	)

	if err := os.MkdirAll(installPaths.ComponentDir, 0o755); err != nil {
		return InstallResult{}, err
	}

	pkg, err := registry.LoadPackageManifest(proj.RegistryRoot, componentName)
	if err != nil {
		return InstallResult{}, err
	}
	result.Dependencies = internalDependencies(pkg.Dependencies)

	return installBuiltSourceGraph(proj, result, sourceBaseDir, installPaths)
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
	sourceTextByRelativePath := make(map[string]string, len(sourceGraph))
	rewriteablePaths := make([]string, 0)
	for relativePath := range sourceGraph {
		ext := filepath.Ext(relativePath)
		switch ext {
		case ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs":
			data, readErr := os.ReadFile(filepath.Join(sourceBaseDir, filepath.FromSlash(relativePath)))
			if readErr != nil {
				return InstallResult{}, readErr
			}
			sourceTextByRelativePath[relativePath] = string(data)
			rewriteablePaths = append(rewriteablePaths, filepath.ToSlash(relativePath))
		}
	}
	rewrittenByPath, err := rewriteComponentSources(
		proj,
		result.Component,
		installPaths.ComponentDir,
		result.Dependencies,
		sourceGraph,
		sourceTextByRelativePath,
		rewriteablePaths,
	)
	if err != nil {
		return InstallResult{}, err
	}

	err = filepath.WalkDir(sourceBaseDir, func(sourcePath string, entry os.DirEntry, err error) error {
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
		if source.IsBarrelFile(relativePath) && !shouldKeepComponentBarrel(proj) {
			return nil
		}
		destinationPath := filepath.Join(
			installPaths.ComponentDir,
			RewriteInstalledComponentRelativePath(
				proj,
				result.Component,
				relativePath,
				sourceTextByRelativePath[filepath.ToSlash(relativePath)],
			),
		)
		if err := os.MkdirAll(filepath.Dir(destinationPath), 0o755); err != nil {
			return err
		}
		if shouldRewriteComponentSourceFile(destinationPath) {
			if err := os.WriteFile(destinationPath, []byte(rewrittenByPath[filepath.ToSlash(relativePath)]), 0o644); err != nil {
				return err
			}
		} else {
			if err := fsutil.CopyFile(sourcePath, destinationPath); err != nil {
				return err
			}
		}
		result.Files = append(result.Files, destinationPath)
		return nil
	})

	if err != nil {
		return InstallResult{}, err
	}

	return result, nil
}

func shouldKeepComponentBarrel(proj project.Project) bool {
	return proj.Config.Layout.Kind == config.LayoutKindNested && proj.Config.Layout.Barrel
}

func shouldRewriteComponentSourceFile(path string) bool {
	switch filepath.Ext(path) {
	case ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs":
		return true
	default:
		return false
	}
}

func internalDependencies(dependencies map[string]string) []string {
	if len(dependencies) == 0 {
		return nil
	}

	result := make([]string, 0, len(dependencies))
	for packageName := range dependencies {
		if !strings.HasPrefix(packageName, "@arachne/") {
			continue
		}
		result = append(result, strings.TrimPrefix(packageName, "@arachne/"))
	}

	sort.Strings(result)
	return result
}

func InstallDependencies(proj project.Project, packageNames []string) ([]DependencyInstallResult, error) {
	if len(packageNames) == 0 {
		return nil, nil
	}

	pending := dedupePackageNames(packageNames)
	installed := make(map[string]struct{}, len(pending))
	results := make([]DependencyInstallResult, 0, len(pending))

	for len(pending) > 0 {
		packageName := pending[0]
		pending = pending[1:]
		if _, ok := installed[packageName]; ok {
			continue
		}

		sourceBaseDir := source.ResolveSourceDir(filepath.Join(proj.RootDir, "lib", packageName))
		if _, err := os.Stat(sourceBaseDir); err != nil {
			if os.IsNotExist(err) {
				return nil, fmt.Errorf("lib package %q not found. expected %s", packageName, filepath.Join("lib", packageName, "src"))
			}
			return nil, err
		}

		destinationDir := project.ResolveLibPackageDir(proj, packageName)
		if err := os.MkdirAll(destinationDir, 0o755); err != nil {
			return nil, err
		}

		installedFiles, err := installDependencySourceGraph(proj, sourceBaseDir, destinationDir)
		if err != nil {
			return nil, err
		}
		internalDeps, err := loadLibInternalDependencies(proj, packageName)
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

func loadLibInternalDependencies(proj project.Project, packageName string) ([]string, error) {
	data, err := os.ReadFile(filepath.Join(proj.RootDir, "lib", packageName, registry.PackageFileName))
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}

	var manifest registry.PackageManifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return nil, err
	}

	return internalDependencies(manifest.Dependencies), nil
}

func installDependencySourceGraph(proj project.Project, sourceBaseDir string, destinationDir string) ([]string, error) {
	files := make([]string, 0)
	sourceGraph, err := fsutil.CollectRelativeSourceGraph(sourceBaseDir)
	if err != nil {
		return nil, err
	}
	packageName := filepath.Base(filepath.Dir(sourceBaseDir))
	internalDeps, err := loadLibInternalDependencies(proj, packageName)
	if err != nil {
		return nil, err
	}
	rewrittenSources := make(map[string]string)
	rewriteablePaths := make([]string, 0)

	err = filepath.WalkDir(sourceBaseDir, func(sourcePath string, entry os.DirEntry, err error) error {
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
		if source.IsTestFile(relativePath) {
			return nil
		}
		if source.IsBarrelFile(relativePath) && !proj.Config.Layout.Barrel {
			return nil
		}
		destinationPath := filepath.Join(destinationDir, project.RewriteLibRelativePath(relativePath, proj.Config.FileNames.Lib))
		if err := os.MkdirAll(filepath.Dir(destinationPath), 0o755); err != nil {
			return err
		}
		if shouldRewriteComponentSourceFile(destinationPath) {
			sourceBytes, err := os.ReadFile(sourcePath)
			if err != nil {
				return err
			}
			rewrittenSources[filepath.ToSlash(relativePath)] = string(sourceBytes)
			rewriteablePaths = append(rewriteablePaths, filepath.ToSlash(relativePath))
		} else {
			if err := fsutil.CopyFile(sourcePath, destinationPath); err != nil {
				return err
			}
		}
		files = append(files, destinationPath)
		return nil
	})
	if err != nil {
		return nil, err
	}

	if len(rewriteablePaths) == 0 {
		return files, nil
	}

	rewrittenByPath, err := rewriteLibSources(
		proj,
		destinationDir,
		internalDeps,
		sourceGraph,
		rewrittenSources,
		rewriteablePaths,
	)
	if err != nil {
		return nil, err
	}
	for _, relativePath := range rewriteablePaths {
		destinationPath := filepath.Join(destinationDir, project.RewriteLibRelativePath(relativePath, proj.Config.FileNames.Lib))
		if err := os.WriteFile(destinationPath, []byte(rewrittenByPath[filepath.ToSlash(relativePath)]), 0o644); err != nil {
			return nil, err
		}
	}

	return files, nil
}

func dedupePackageNames(packageNames []string) []string {
	if len(packageNames) == 0 {
		return nil
	}

	seen := make(map[string]struct{}, len(packageNames))
	result := make([]string, 0, len(packageNames))
	for _, packageName := range packageNames {
		if _, ok := seen[packageName]; ok {
			continue
		}
		seen[packageName] = struct{}{}
		result = append(result, packageName)
	}

	sort.Strings(result)
	return result
}
