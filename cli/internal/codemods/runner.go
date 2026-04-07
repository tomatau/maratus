package codemods

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

type Manifest[TOptions any] struct {
	CodemodPackageName string   `json:"codemodPackageName"`
	CodemodExportName  string   `json:"codemodExportName"`
	Files              []File   `json:"files"`
	Options            TOptions `json:"options"`
}

type File struct {
	Path       string `json:"path"`
	SourceText string `json:"sourceText"`
}

type Output struct {
	Files []File `json:"files"`
}

type RunnerCommand struct {
	Args []string
	Dir  string
}

func WriteManifest(pattern string, manifest any) (string, error) {
	encoded, err := json.Marshal(manifest)
	if err != nil {
		return "", err
	}

	file, err := os.CreateTemp("", pattern)
	if err != nil {
		return "", err
	}
	defer file.Close()

	if _, err := file.Write(encoded); err != nil {
		return "", err
	}

	return file.Name(), nil
}

func RunManifest(command RunnerCommand) (Output, error) {
	execCommand := exec.Command(command.Args[0], command.Args[1:]...)
	execCommand.Dir = command.Dir

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	execCommand.Stdout = &stdout
	execCommand.Stderr = &stderr

	if err := execCommand.Run(); err != nil {
		return Output{}, fmt.Errorf(
			"run codemod: %w: %s",
			err,
			strings.TrimSpace(stderr.String()),
		)
	}

	var output Output
	if err := json.Unmarshal(stdout.Bytes(), &output); err != nil {
		return Output{}, err
	}

	return output, nil
}
