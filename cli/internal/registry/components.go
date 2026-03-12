// Package registry owns how the CLI discovers installable components.
//
// Today that is just a local "registry" directory in the repo. Later this
// package will be the right place to swap that for a manifest-driven or
// package-manager-backed registry without pushing that knowledge into commands.
package registry

import (
	"os"
	"path/filepath"
	"sort"
)

// DefaultRootDir is the current local registry location within the project.
const DefaultRootDir = "registry"

func ResolveRoot(projectRoot string) string {
	return filepath.Join(projectRoot, DefaultRootDir)
}

func AvailableComponents(componentsRoot string) ([]string, error) {
	entries, err := os.ReadDir(componentsRoot)
	if err != nil {
		return nil, err
	}

	var out []string
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		out = append(out, entry.Name())
	}
	sort.Strings(out)
	return out, nil
}
