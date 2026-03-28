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

	supported := MustGet(RewriteInternalImportsName)
	manifest := Manifest[RewriteInternalImportsOptions]{
		CodemodPackageName: supported.PackageName,
		CodemodExportName:  supported.ExportName,
		Files: []File{
			{
				Path:       destinationPath,
				SourceText: string(source),
			},
		},
		Options: options,
	}

	manifestPath, err := WriteManifest(
		"arachne-rewrite-internal-imports-*.json",
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
	if len(output.Files) == 0 {
		return string(source), nil
	}

	return output.Files[0].SourceText, nil
}
