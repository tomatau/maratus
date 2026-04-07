package codemods

import (
	"os"
	"path/filepath"
	"sort"
)

type RewriteRelativeImportsOptions struct {
	Files []RewriteRelativeImportsFileOption `json:"files"`
}

type RewriteRelativeImportsFileOption struct {
	Path          string `json:"path"`
	FileNameKind  string `json:"fileNameKind"`
	RewrittenPath string `json:"rewrittenPath"`
}

func RewriteRelativeImports(
	runnerCommand RunnerCommand,
	codemodPackageName string,
	codemodExportName string,
	sourcePath string,
	destinationPath string,
	source string,
	sourceGraph map[string]string,
	options RewriteRelativeImportsOptions,
) (string, error) {
	manifest := Manifest[RewriteRelativeImportsOptions]{
		CodemodPackageName: codemodPackageName,
		CodemodExportName:  codemodExportName,
		Files:              make([]File, 0, len(sourceGraph)),
		Options:            options,
	}

	for graphPath := range sourceGraph {
		normalizedPath := filepath.ToSlash(graphPath)
		sourceText := ""
		if normalizedPath == sourcePath {
			sourceText = source
		}

		manifest.Files = append(manifest.Files, File{
			Path:       normalizedPath,
			SourceText: sourceText,
		})
	}

	sort.Slice(manifest.Files, func(i, j int) bool {
		return manifest.Files[i].Path < manifest.Files[j].Path
	})
	sort.Slice(manifest.Options.Files, func(i, j int) bool {
		return manifest.Options.Files[i].Path < manifest.Options.Files[j].Path
	})

	manifestFilePath, err := WriteManifest(
		"maratus-rewrite-relative-imports-*.json",
		manifest,
	)
	if err != nil {
		return "", err
	}
	defer os.Remove(manifestFilePath)

	command := RunnerCommand{
		Args: append(append([]string(nil), runnerCommand.Args...), manifestFilePath),
		Dir:  runnerCommand.Dir,
	}
	output, err := RunManifest(command)
	if err != nil {
		return "", err
	}

	for _, file := range output.Files {
		if filepath.ToSlash(file.Path) == destinationPath || filepath.ToSlash(file.Path) == sourcePath {
			return file.SourceText, nil
		}
	}

	return source, nil
}

func RewriteRelativeImportsBatch(
	runnerCommand RunnerCommand,
	codemodPackageName string,
	codemodExportName string,
	files []File,
	sourceGraph map[string]string,
	options RewriteRelativeImportsOptions,
) ([]File, error) {
	if len(files) == 0 {
		return nil, nil
	}

	manifest := Manifest[RewriteRelativeImportsOptions]{
		CodemodPackageName: codemodPackageName,
		CodemodExportName:  codemodExportName,
		Files:              files,
		Options:            options,
	}

	sort.Slice(manifest.Files, func(i, j int) bool {
		return manifest.Files[i].Path < manifest.Files[j].Path
	})
	sort.Slice(manifest.Options.Files, func(i, j int) bool {
		return manifest.Options.Files[i].Path < manifest.Options.Files[j].Path
	})

	manifestFilePath, err := WriteManifest(
		"maratus-rewrite-relative-imports-*.json",
		manifest,
	)
	if err != nil {
		return nil, err
	}
	defer os.Remove(manifestFilePath)

	command := RunnerCommand{
		Args: append(append([]string(nil), runnerCommand.Args...), manifestFilePath),
		Dir:  runnerCommand.Dir,
	}
	output, err := RunManifest(command)
	if err != nil {
		return nil, err
	}

	return output.Files, nil
}
