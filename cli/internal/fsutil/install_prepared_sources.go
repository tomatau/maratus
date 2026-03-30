package fsutil

import (
	"os"
	"path/filepath"
)

type PreparedSourceFiles struct {
	Files            []string
	RewriteablePaths []string
}

func InstallPreparedSourceFiles(
	prepared PreparedSourceFiles,
	destinationPath func(relativePath string) string,
	rewrite func() (map[string]string, error),
) ([]string, error) {
	if len(prepared.RewriteablePaths) == 0 {
		return prepared.Files, nil
	}

	rewrittenByPath, err := rewrite()
	if err != nil {
		return nil, err
	}

	for _, relativePath := range prepared.RewriteablePaths {
		if err := os.WriteFile(
			destinationPath(relativePath),
			[]byte(rewrittenByPath[filepath.ToSlash(relativePath)]),
			0o644,
		); err != nil {
			return nil, err
		}
	}

	return prepared.Files, nil
}
