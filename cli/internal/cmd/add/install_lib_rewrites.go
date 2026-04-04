package addcmd

import (
	"maratus/cli/internal/codemods"
	"maratus/cli/internal/project"
	"maratus/cli/internal/source"
	"path/filepath"
)

func rewriteLibSources(
	proj project.Project,
	destinationDir string,
	internalDeps []string,
	sourceGraph map[string]string,
	rewrittenSources map[string]string,
	rewriteablePaths []string,
) (map[string]string, error) {
	rewritten := cloneSourceTextMap(rewrittenSources)

	internalRewriteOptions := codemods.RewriteInternalImportsOptions{
		Packages: make([]codemods.RewriteInternalImportsPackage, 0, len(internalDeps)),
	}
	for _, dependency := range internalDeps {
		internalRewriteOptions.Packages = append(
			internalRewriteOptions.Packages,
			codemods.RewriteInternalImportsPackage{
				PackageName:    dependency,
				SourceDir:      source.ResolveSourceDir(filepath.Join(proj.RootDir, "lib", dependency)),
				DestinationDir: project.ResolveLibPackageDir(proj, dependency),
				Barrel:         proj.Config.Layout.Barrel,
				FileNameKind:   string(proj.Config.FileNames.Lib),
			},
		)
	}

	internalRewriteFiles := make([]codemods.File, 0, len(rewriteablePaths))
	for _, relativePath := range rewriteablePaths {
		destinationPath := filepath.ToSlash(filepath.Join(destinationDir, project.RewriteLibRelativePath(relativePath, proj.Config.FileNames.Lib)))
		internalRewriteFiles = append(internalRewriteFiles, codemods.File{
			Path:       destinationPath,
			SourceText: rewritten[relativePath],
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
				Path:          filepath.ToSlash(graphPath),
				FileNameKind:  string(proj.Config.FileNames.Lib),
				RewrittenPath: filepath.ToSlash(project.RewriteLibRelativePath(graphPath, proj.Config.FileNames.Lib)),
			},
		)
	}

	relativeRewriteFiles := make([]codemods.File, 0, len(rewriteablePaths))
	for _, relativePath := range rewriteablePaths {
		destinationPath := filepath.ToSlash(filepath.Join(destinationDir, project.RewriteLibRelativePath(relativePath, proj.Config.FileNames.Lib)))
		sourceText := rewritten[relativePath]
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

func cloneSourceTextMap(values map[string]string) map[string]string {
	cloned := make(map[string]string, len(values))
	for key, value := range values {
		cloned[key] = value
	}

	return cloned
}
