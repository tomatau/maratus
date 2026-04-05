package codemods

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
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

func RunManifest(manifestPath string) (Output, error) {
	command := exec.Command(
		"bun",
		"run",
		"maratus-codemod-runner",
		manifestPath,
	)
	command.Dir = maratusRepoRoot()

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	command.Stdout = &stdout
	command.Stderr = &stderr

	if err := command.Run(); err != nil {
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

func maratusRepoRoot() string {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		return "."
	}

	root, err := findMaratusRepoRoot(filepath.Dir(file))
	if err != nil {
		return "."
	}

	return root
}

func findMaratusRepoRoot(start string) (string, error) {
	current := filepath.Clean(start)

	for {
		repoConfigPath := filepath.Join(current, "repo.yml")
		if _, err := os.Stat(repoConfigPath); err == nil {
			return current, nil
		}

		parent := filepath.Dir(current)
		if parent == current {
			break
		}

		current = parent
	}

	return "", fmt.Errorf("maratus repo root not found")
}
