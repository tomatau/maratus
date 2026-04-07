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
	runnerCommand RunnerCommand,
	codemodPackageName string,
	codemodExportName string,
	destinationPath string,
	source []byte,
	options RewriteInternalImportsOptions,
) (string, error) {
	if len(options.Packages) == 0 {
		return string(source), nil
	}

	output, err := rewriteInternalImportsOutput(
		runnerCommand,
		codemodPackageName,
		codemodExportName,
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
	runnerCommand RunnerCommand,
	codemodPackageName string,
	codemodExportName string,
	files []File,
	options RewriteInternalImportsOptions,
) ([]File, error) {
	if len(options.Packages) == 0 || len(files) == 0 {
		return files, nil
	}

	output, err := rewriteInternalImportsOutput(
		runnerCommand,
		codemodPackageName,
		codemodExportName,
		files,
		options,
	)
	if err != nil {
		return nil, err
	}

	return output.Files, nil
}

func rewriteInternalImportsOutput(
	runnerCommand RunnerCommand,
	codemodPackageName string,
	codemodExportName string,
	files []File,
	options RewriteInternalImportsOptions,
) (Output, error) {
	manifest := Manifest[RewriteInternalImportsOptions]{
		CodemodPackageName: codemodPackageName,
		CodemodExportName:  codemodExportName,
		Files:              files,
		Options:            options,
	}

	manifestFilePath, err := WriteManifest(
		"maratus-rewrite-internal-imports-*.json",
		manifest,
	)
	if err != nil {
		return Output{}, err
	}
	defer os.Remove(manifestFilePath)

	command := RunnerCommand{
		Args: append(append([]string(nil), runnerCommand.Args...), manifestFilePath),
		Dir:  runnerCommand.Dir,
	}
	return RunManifest(command)
}
