package addcmd

import (
	"maratus/cli/internal/fsutil"
	"maratus/cli/internal/source"
	"os"
	"path/filepath"
)

type preparedInstallFiles struct {
	Files            []string
	SourceTextByPath map[string]string
	RewriteablePaths []string
}

func prepareInstallFiles(
	sourceBaseDir string,
	destinationDir string,
	shouldSkip func(string) bool,
	rewritePath func(relativePath string, sourceText string) string,
) (preparedInstallFiles, error) {
	prepared := preparedInstallFiles{
		Files:            make([]string, 0),
		SourceTextByPath: make(map[string]string),
		RewriteablePaths: make([]string, 0),
	}

	err := filepath.WalkDir(sourceBaseDir, func(sourcePath string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}

		relativePath, err := filepath.Rel(sourceBaseDir, sourcePath)
		if err != nil {
			return err
		}
		if shouldSkip(relativePath) {
			return nil
		}

		normalizedRelativePath := filepath.ToSlash(relativePath)
		sourceText := ""
		if source.IsRewriteableSourceFile(relativePath) {
			sourceBytes, err := os.ReadFile(sourcePath)
			if err != nil {
				return err
			}
			sourceText = string(sourceBytes)
			prepared.SourceTextByPath[normalizedRelativePath] = sourceText
			prepared.RewriteablePaths = append(prepared.RewriteablePaths, normalizedRelativePath)
		}

		destinationPath := filepath.Join(destinationDir, rewritePath(relativePath, sourceText))
		if err := os.MkdirAll(filepath.Dir(destinationPath), 0o755); err != nil {
			return err
		}
		if !source.IsRewriteableSourceFile(relativePath) {
			if err := fsutil.CopyFile(sourcePath, destinationPath); err != nil {
				return err
			}
		}

		prepared.Files = append(prepared.Files, destinationPath)
		return nil
	})
	if err != nil {
		return prepared, err
	}

	return prepared, nil
}
