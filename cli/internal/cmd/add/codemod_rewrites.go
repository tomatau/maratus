package addcmd

import (
	"arachne/cli/internal/project"
	"os"
	"path/filepath"
	"sort"
)

type rewriteInternalImportsOptions struct {
	Packages []rewriteInternalImportsPackage `json:"packages"`
}

type rewriteInternalImportsPackage struct {
	PackageName    string `json:"packageName"`
	SourceDir      string `json:"sourceDir"`
	DestinationDir string `json:"destinationDir"`
	Barrel         bool   `json:"barrel"`
	FileNameKind   string `json:"fileNameKind"`
}

type rewriteRelativeImportsOptions struct {
	Files []rewriteRelativeImportsFileOption `json:"files"`
}

type rewriteRelativeImportsFileOption struct {
	Path         string `json:"path"`
	FileNameKind string `json:"fileNameKind"`
}

func rewriteInternalDependencyImports(
	proj project.Project,
	destinationPath string,
	source []byte,
	dependencies []string,
) (string, error) {
	if len(dependencies) == 0 {
		return string(source), nil
	}

	manifest := codemodManifest[rewriteInternalImportsOptions]{
		CodemodPackageName: "@arachne-codemod/rewrite-internal-imports",
		CodemodExportName:  "rewriteInternalPackageImports",
		Files: []codemodFile{
			{
				Path:       destinationPath,
				SourceText: string(source),
			},
		},
		Options: rewriteInternalImportsOptions{
			Packages: make([]rewriteInternalImportsPackage, 0, len(dependencies)),
		},
	}

	for _, dependency := range dependencies {
		manifest.Options.Packages = append(
			manifest.Options.Packages,
			rewriteInternalImportsPackage{
				PackageName:    dependency,
				SourceDir:      filepath.Join(proj.RootDir, "lib", dependency, "src"),
				DestinationDir: project.ResolveLibPackageDir(proj, dependency),
				Barrel:         proj.Config.Layout.Barrel,
				FileNameKind:   string(proj.Config.FileNames.Lib),
			},
		)
	}

	manifestPath, err := writeCodemodManifest(
		"arachne-rewrite-internal-imports-*.json",
		manifest,
	)
	if err != nil {
		return "", err
	}
	defer os.Remove(manifestPath)

	output, err := runCodemodManifest(manifestPath)
	if err != nil {
		return "", err
	}
	if len(output.Files) == 0 {
		return string(source), nil
	}

	return output.Files[0].SourceText, nil
}

func rewriteRelativeImports(
	sourcePath string,
	destinationPath string,
	source string,
	sourceGraph map[string]string,
	fileNameKind string,
) (string, error) {
	manifest := codemodManifest[rewriteRelativeImportsOptions]{
		CodemodPackageName: "@arachne-codemod/rewrite-relative-imports",
		CodemodExportName:  "rewriteRelativeImports",
		Files:              make([]codemodFile, 0, len(sourceGraph)),
		Options: rewriteRelativeImportsOptions{
			Files: make([]rewriteRelativeImportsFileOption, 0, len(sourceGraph)),
		},
	}

	for graphPath := range sourceGraph {
		normalizedPath := filepath.ToSlash(graphPath)
		sourceText := ""
		if normalizedPath == sourcePath {
			sourceText = source
		}

		manifest.Files = append(manifest.Files, codemodFile{
			Path:       normalizedPath,
			SourceText: sourceText,
		})
		manifest.Options.Files = append(
			manifest.Options.Files,
			rewriteRelativeImportsFileOption{
				Path:         normalizedPath,
				FileNameKind: fileNameKind,
			},
		)
	}

	sort.Slice(manifest.Files, func(i, j int) bool {
		return manifest.Files[i].Path < manifest.Files[j].Path
	})
	sort.Slice(manifest.Options.Files, func(i, j int) bool {
		return manifest.Options.Files[i].Path < manifest.Options.Files[j].Path
	})

	manifestPath, err := writeCodemodManifest(
		"arachne-rewrite-relative-imports-*.json",
		manifest,
	)
	if err != nil {
		return "", err
	}
	defer os.Remove(manifestPath)

	output, err := runCodemodManifest(manifestPath)
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
