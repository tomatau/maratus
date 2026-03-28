package fsutil

import (
	"os"
	"path/filepath"
)

func CollectRelativeSourceGraph(rootDir string) (map[string]string, error) {
	graph := make(map[string]string)

	err := filepath.WalkDir(rootDir, func(sourcePath string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}

		relativePath, err := filepath.Rel(rootDir, sourcePath)
		if err != nil {
			return err
		}
		graph[filepath.ToSlash(relativePath)] = filepath.ToSlash(relativePath)
		return nil
	})
	if err != nil {
		return nil, err
	}

	return graph, nil
}
