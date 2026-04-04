package addcmd

import (
	"maratus/cli/internal/codemods"
	"maratus/cli/internal/project"
	"path/filepath"
)

func rewriteInternalDependencyImports(
	proj project.Project,
	destinationPath string,
	source []byte,
	dependencies []string,
) (string, error) {
	if len(dependencies) == 0 {
		return string(source), nil
	}

	options := codemods.RewriteInternalImportsOptions{
		Packages: make([]codemods.RewriteInternalImportsPackage, 0, len(dependencies)),
	}

	for _, dependency := range dependencies {
		options.Packages = append(
			options.Packages,
			codemods.RewriteInternalImportsPackage{
				PackageName:    dependency,
				SourceDir:      filepath.Join(proj.RootDir, "lib", dependency, "src"),
				DestinationDir: project.ResolveLibPackageDir(proj, dependency),
				Barrel:         proj.Config.Layout.Barrel,
				FileNameKind:   string(proj.Config.FileNames.Lib),
			},
		)
	}

	return codemods.RewriteInternalImports(destinationPath, source, options)
}

func rewriteRelativeImports(
	sourcePath string,
	destinationPath string,
	source string,
	sourceGraph map[string]string,
	fileNameKind string,
	rewritePath func(string) string,
) (string, error) {
	options := codemods.RewriteRelativeImportsOptions{
		Files: make([]codemods.RewriteRelativeImportsFileOption, 0, len(sourceGraph)),
	}

	for graphPath := range sourceGraph {
		normalizedPath := filepath.ToSlash(graphPath)
		options.Files = append(
			options.Files,
			codemods.RewriteRelativeImportsFileOption{
				Path:          normalizedPath,
				FileNameKind:  fileNameKind,
				RewrittenPath: filepath.ToSlash(rewritePath(graphPath)),
			},
		)
	}

	return codemods.RewriteRelativeImports(
		sourcePath,
		destinationPath,
		source,
		sourceGraph,
		options,
	)
}
