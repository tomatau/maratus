package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/fsutil"
	"arachne/cli/internal/project"
	"arachne/cli/internal/registry"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

type InstallResult struct {
	Component    string
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
		if shouldRewriteComponentSourceFile(destinationPath) {
			source, err := os.ReadFile(sourcePath)
			if err != nil {
				return err
			}
			rewritten := rewriteComponentDependencyImports(proj, destinationPath, source, result.Dependencies)
			if err := os.WriteFile(destinationPath, rewritten, 0o644); err != nil {
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

func shouldRewriteComponentSourceFile(path string) bool {
	switch filepath.Ext(path) {
	case ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs":
		return true
	default:
		return false
	}
}

func rewriteComponentDependencyImports(proj project.Project, destinationPath string, source []byte, dependencies []string) []byte {
	rewritten := string(source)

	for _, dependency := range dependencies {
		relativeImportPath, err := filepath.Rel(filepath.Dir(destinationPath), project.ResolveLibPackageDir(proj, dependency))
		if err != nil {
			continue
		}

		modulePath := filepath.ToSlash(relativeImportPath)
		if !strings.HasPrefix(modulePath, ".") {
			modulePath = "./" + modulePath
		}

		packageSpecifier := "@arachne/" + dependency
		rewritten = strings.ReplaceAll(rewritten, `"`+packageSpecifier+`"`, `"`+modulePath+`"`)
		rewritten = strings.ReplaceAll(rewritten, `'`+packageSpecifier+`'`, `'`+modulePath+`'`)
	}

	return []byte(rewritten)
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

	deduped := dedupePackageNames(packageNames)
	results := make([]DependencyInstallResult, 0, len(deduped))

	for _, packageName := range deduped {
		sourceBaseDir := filepath.Join(proj.RootDir, "lib", packageName, "src")
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

		installedFiles, err := installDependencySourceGraph(sourceBaseDir, destinationDir)
		if err != nil {
			return nil, err
		}
		results = append(results, DependencyInstallResult{
			Package: packageName,
			Files:   installedFiles,
		})
	}

	return results, nil
}

func installDependencySourceGraph(sourceBaseDir string, destinationDir string) ([]string, error) {
	files := make([]string, 0)

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
		destinationPath := filepath.Join(destinationDir, relativePath)
		if err := os.MkdirAll(filepath.Dir(destinationPath), 0o755); err != nil {
			return err
		}
		if err := fsutil.CopyFile(sourcePath, destinationPath); err != nil {
			return err
		}
		files = append(files, destinationPath)
		return nil
	})
	if err != nil {
		return nil, err
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
