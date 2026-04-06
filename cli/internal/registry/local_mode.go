package registry

import (
	"path/filepath"
)

// DefaultRootDir is the current local registry location within the project.
const DefaultRootDir = "registry"

func ResolveRoot(projectRoot string) string {
	return filepath.Join(projectRoot, DefaultRootDir)
}
