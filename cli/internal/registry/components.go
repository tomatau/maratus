// Package registry owns how the CLI discovers installable components.
//
// Today that is just a local "registry" directory in the repo. Later this
// package will be the right place to swap that for a manifest-driven or
// package-manager-backed registry without pushing that knowledge into commands.
package registry

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
)

// DefaultRootDir is the current local registry location within the project.
const DefaultRootDir = "registry"

type ManifestComponent struct {
	Name    string `json:"name"`
	Package string `json:"package"`
	Version string `json:"version"`
}

type Manifest struct {
	Version    int                          `json:"version"`
	Components map[string]ManifestComponent `json:"components"`
}

func ResolveRoot(projectRoot string) string {
	return filepath.Join(projectRoot, DefaultRootDir)
}

func LoadManifest(path string) (Manifest, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Manifest{}, err
	}

	var manifest Manifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return Manifest{}, err
	}

	if manifest.Components == nil {
		manifest.Components = map[string]ManifestComponent{}
	}

	return manifest, nil
}

func AvailableComponents(path string) ([]string, error) {
	manifest, err := LoadManifest(path)
	if err != nil {
		return nil, err
	}

	out := make([]string, 0, len(manifest.Components))
	for componentName := range manifest.Components {
		out = append(out, componentName)
	}
	sort.Strings(out)
	return out, nil
}

func ResolveComponentPackageSpecs(
	path string,
	componentNames []string,
) ([]string, error) {
	manifest, err := LoadManifest(path)
	if err != nil {
		return nil, err
	}

	specs := make([]string, 0, len(componentNames))
	for _, componentName := range componentNames {
		component, ok := manifest.Components[componentName]
		if !ok {
			return nil, os.ErrNotExist
		}
		specs = append(specs, component.Package+"@"+component.Version)
	}

	return specs, nil
}
