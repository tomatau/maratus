package addcmd

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

type codemodManifest[TOptions any] struct {
	CodemodPackageName string        `json:"codemodPackageName"`
	CodemodExportName  string        `json:"codemodExportName"`
	Files              []codemodFile `json:"files"`
	Options            TOptions      `json:"options"`
}

type codemodFile struct {
	Path       string `json:"path"`
	SourceText string `json:"sourceText"`
}

type codemodOutput struct {
	Files []codemodFile `json:"files"`
}

func writeCodemodManifest(pattern string, manifest any) (string, error) {
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

func runCodemodManifest(manifestPath string) (codemodOutput, error) {
	command := exec.Command(
		"bun",
		"run",
		"arachne-morph",
		manifestPath,
	)
	command.Dir = arachneRepoRoot()

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	command.Stdout = &stdout
	command.Stderr = &stderr

	if err := command.Run(); err != nil {
		return codemodOutput{}, fmt.Errorf(
			"run codemod: %w: %s",
			err,
			strings.TrimSpace(stderr.String()),
		)
	}

	var output codemodOutput
	if err := json.Unmarshal(stdout.Bytes(), &output); err != nil {
		return codemodOutput{}, err
	}

	return output, nil
}

func arachneRepoRoot() string {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		return "."
	}

	root, err := findArachneRepoRoot(filepath.Dir(file))
	if err != nil {
		return "."
	}

	return root
}

func findArachneRepoRoot(start string) (string, error) {
	current := filepath.Clean(start)

	for {
		packageJSONPath := filepath.Join(current, "package.json")
		data, err := os.ReadFile(packageJSONPath)
		if err == nil {
			var pkg struct {
				Name string `json:"name"`
			}
			if json.Unmarshal(data, &pkg) == nil && pkg.Name == "arachne" {
				return current, nil
			}
		}

		parent := filepath.Dir(current)
		if parent == current {
			break
		}

		current = parent
	}

	return "", errors.New("arachne repo root not found")
}
