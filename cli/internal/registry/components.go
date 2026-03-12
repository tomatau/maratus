package registry

import (
	"os"
	"path/filepath"
	"sort"
)

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
