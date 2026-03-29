package codemods

import "os"

type RewriteInternalImportsOptions struct {
	Packages []RewriteInternalImportsPackage `json:"packages"`
}

type RewriteInternalImportsPackage struct {
	PackageName    string `json:"packageName"`
	SourceDir      string `json:"sourceDir"`
	DestinationDir string `json:"destinationDir"`
	Barrel         bool   `json:"barrel"`
	FileNameKind   string `json:"fileNameKind"`
}

func RewriteInternalImports(
	destinationPath string,
	source []byte,
	options RewriteInternalImportsOptions,
) (string, error) {
	if len(options.Packages) == 0 {
		return string(source), nil
	}

	output, err := rewriteInternalImportsOutput(
		[]File{
			{
				Path:       destinationPath,
				SourceText: string(source),
			},
		},
		options,
	)
	if err != nil {
		return "", err
	}
	if len(output.Files) == 0 {
		return string(source), nil
	}

	return output.Files[0].SourceText, nil
}

func RewriteInternalImportsBatch(
	files []File,
	options RewriteInternalImportsOptions,
) ([]File, error) {
	if len(options.Packages) == 0 || len(files) == 0 {
		return files, nil
	}

	output, err := rewriteInternalImportsOutput(files, options)
	if err != nil {
		return nil, err
	}

	return output.Files, nil
}

func rewriteInternalImportsOutput(
	files []File,
	options RewriteInternalImportsOptions,
) (Output, error) {
	supported := MustGet(RewriteInternalImportsName)
	manifest := Manifest[RewriteInternalImportsOptions]{
		CodemodPackageName: supported.PackageName,
		CodemodExportName:  supported.ExportName,
		Files:              files,
		Options:            options,
	}

	manifestPath, err := WriteManifest(
		"arachne-rewrite-internal-imports-*.json",
		manifest,
	)
	if err != nil {
		return Output{}, err
	}
	defer os.Remove(manifestPath)

	return RunManifest(manifestPath)
}
