package addcmd

import (
	"maratus/cli/internal/codemods"
	"maratus/cli/internal/manifest"
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

	codemod, err := resolveCodemod(proj, codemods.RewriteInternalImportsName)
	if err != nil {
		return "", err
	}

	runnerCommand, err := resolveCodemodRunnerCommand(proj)
	if err != nil {
		return "", err
	}

	return codemods.RewriteInternalImports(
		runnerCommand,
		codemod.Package,
		codemod.ExportName,
		destinationPath,
		source,
		options,
	)
}

func rewriteRelativeImports(
	proj project.Project,
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

	codemod, err := resolveCodemod(proj, codemods.RewriteRelativeImportsName)
	if err != nil {
		return "", err
	}

	runnerCommand, err := resolveCodemodRunnerCommand(proj)
	if err != nil {
		return "", err
	}

	return codemods.RewriteRelativeImports(
		runnerCommand,
		codemod.Package,
		codemod.ExportName,
		sourcePath,
		destinationPath,
		source,
		sourceGraph,
		options,
	)
}

func resolveCodemod(
	proj project.Project,
	codemodName string,
) (manifest.Codemod, error) {
	return manifest.ResolveCodemod(proj.RegistryManifestPath, codemodName)
}

func resolveCodemodRunnerCommand(proj project.Project) (codemods.RunnerCommand, error) {
	command, err := project.ResolveProjectPackageRunCommand(
		proj,
		codemods.RunnerPackageName,
		codemods.RunnerBinaryName,
		nil,
	)
	if err != nil {
		return codemods.RunnerCommand{}, err
	}

	return codemods.RunnerCommand{
		Args: command.Args,
		Dir:  command.Dir,
	}, nil
}
