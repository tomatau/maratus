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
	Path         string `json:"path"`
	FileNameKind string `json:"fileNameKind"`
}

func RewriteRelativeImports(
	sourcePath string,
	destinationPath string,
	source string,
	sourceGraph map[string]string,
	options RewriteRelativeImportsOptions,
) (string, error) {
	supported := MustGet(RewriteRelativeImportsName)
	manifest := Manifest[RewriteRelativeImportsOptions]{
		CodemodPackageName: supported.PackageName,
		CodemodExportName:  supported.ExportName,
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

	manifestPath, err := WriteManifest(
		"arachne-rewrite-relative-imports-*.json",
		manifest,
	)
	if err != nil {
		return "", err
	}
	defer os.Remove(manifestPath)

	output, err := RunManifest(manifestPath)
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
