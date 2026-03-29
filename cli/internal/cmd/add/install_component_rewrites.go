package addcmd

import (
	"arachne/cli/internal/codemods"
	"arachne/cli/internal/project"
	"path/filepath"
)

func rewriteComponentSources(
	proj project.Project,
	componentName string,
	destinationDir string,
	dependencies []string,
	sourceGraph map[string]string,
	sourceTextByRelativePath map[string]string,
	rewriteablePaths []string,
) (map[string]string, error) {
	rewritten := cloneSourceTextMap(sourceTextByRelativePath)

	internalRewriteOptions := codemods.RewriteInternalImportsOptions{
		Packages: make([]codemods.RewriteInternalImportsPackage, 0, len(dependencies)),
	}
	for _, dependency := range dependencies {
		internalRewriteOptions.Packages = append(
			internalRewriteOptions.Packages,
			codemods.RewriteInternalImportsPackage{
				PackageName:    dependency,
				SourceDir:      filepath.Join(proj.RootDir, "lib", dependency, "src"),
				DestinationDir: project.ResolveLibPackageDir(proj, dependency),
				Barrel:         proj.Config.Layout.Barrel,
				FileNameKind:   string(proj.Config.FileNames.Lib),
			},
		)
	}

	internalRewriteFiles := make([]codemods.File, 0, len(rewriteablePaths))
	for _, relativePath := range rewriteablePaths {
		destinationPath := filepath.ToSlash(filepath.Join(
			destinationDir,
			RewriteInstalledComponentRelativePath(
				proj,
				componentName,
				relativePath,
				sourceTextByRelativePath[filepath.ToSlash(relativePath)],
			),
		))
		internalRewriteFiles = append(internalRewriteFiles, codemods.File{
			Path:       destinationPath,
			SourceText: rewritten[filepath.ToSlash(relativePath)],
		})
	}
	if len(internalRewriteOptions.Packages) > 0 {
		internalRewriteOutput, err := codemods.RewriteInternalImportsBatch(internalRewriteFiles, internalRewriteOptions)
		if err != nil {
			return nil, err
		}
		for _, file := range internalRewriteOutput {
			rewritten[filepath.ToSlash(file.Path)] = file.SourceText
		}
	}

	relativeRewriteOptions := codemods.RewriteRelativeImportsOptions{
		Files: make([]codemods.RewriteRelativeImportsFileOption, 0, len(sourceGraph)),
	}
	for graphPath := range sourceGraph {
		relativeRewriteOptions.Files = append(
			relativeRewriteOptions.Files,
			codemods.RewriteRelativeImportsFileOption{
				Path:         filepath.ToSlash(graphPath),
				FileNameKind: string(proj.Config.FileNames.Components),
				RewrittenPath: filepath.ToSlash(RewriteInstalledComponentRelativePath(
					proj,
					componentName,
					graphPath,
					sourceTextByRelativePath[filepath.ToSlash(graphPath)],
				)),
			},
		)
	}

	relativeRewriteFiles := make([]codemods.File, 0, len(rewriteablePaths))
	for _, relativePath := range rewriteablePaths {
		sourceText := rewritten[filepath.ToSlash(relativePath)]
		destinationPath := filepath.ToSlash(filepath.Join(
			destinationDir,
			RewriteInstalledComponentRelativePath(
				proj,
				componentName,
				relativePath,
				sourceTextByRelativePath[filepath.ToSlash(relativePath)],
			),
		))
		if updatedSource, ok := rewritten[destinationPath]; ok {
			sourceText = updatedSource
		}
		relativeRewriteFiles = append(relativeRewriteFiles, codemods.File{
			Path:       filepath.ToSlash(relativePath),
			SourceText: sourceText,
		})
	}

	relativeRewriteOutput, err := codemods.RewriteRelativeImportsBatch(relativeRewriteFiles, sourceGraph, relativeRewriteOptions)
	if err != nil {
		return nil, err
	}

	rewrittenByPath := make(map[string]string, len(relativeRewriteOutput))
	for _, file := range relativeRewriteOutput {
		rewrittenByPath[filepath.ToSlash(file.Path)] = file.SourceText
	}

	return rewrittenByPath, nil
}
