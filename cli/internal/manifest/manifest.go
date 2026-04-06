// Package manifest loads the published Maratus manifest document.
//
// The CLI uses this manifest for artefact discovery, including available
// components and codemods, in both repo mode and consumer mode.
package manifest

import (
	"encoding/json"
	"os"
	"sort"
)

type Component struct {
	Name    string `json:"name"`
	Package string `json:"package"`
	Version string `json:"version"`
}

type Codemod struct {
	Category   string `json:"category"`
	ExportName string `json:"exportName"`
	Package    string `json:"package"`
	Version    string `json:"version"`
}

type Document struct {
	Version    int                  `json:"version"`
	Components map[string]Component `json:"components"`
	Codemods   map[string]Codemod   `json:"codemods"`
}

func Load(path string) (Document, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Document{}, err
	}

	var document Document
	if err := json.Unmarshal(data, &document); err != nil {
		return Document{}, err
	}

	if document.Components == nil {
		document.Components = map[string]Component{}
	}
	if document.Codemods == nil {
		document.Codemods = map[string]Codemod{}
	}

	return document, nil
}

func AvailableComponents(path string) ([]string, error) {
	document, err := Load(path)
	if err != nil {
		return nil, err
	}

	out := make([]string, 0, len(document.Components))
	for componentName := range document.Components {
		out = append(out, componentName)
	}
	sort.Strings(out)
	return out, nil
}

func ResolveComponentPackageSpecs(
	path string,
	componentNames []string,
) ([]string, error) {
	document, err := Load(path)
	if err != nil {
		return nil, err
	}

	specs := make([]string, 0, len(componentNames))
	for _, componentName := range componentNames {
		component, ok := document.Components[componentName]
		if !ok {
			return nil, os.ErrNotExist
		}
		specs = append(specs, component.Package+"@"+component.Version)
	}

	return specs, nil
}

func ResolveCodemod(path string, codemodName string) (Codemod, error) {
	document, err := Load(path)
	if err != nil {
		return Codemod{}, err
	}

	codemod, ok := document.Codemods[codemodName]
	if !ok {
		return Codemod{}, os.ErrNotExist
	}

	return codemod, nil
}
