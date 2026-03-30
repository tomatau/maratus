package source

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

const testFileSuffix = ".test.ts"
const sourceDirName = "src"

func IsRewriteableSourceFile(path string) bool {
	switch filepath.Ext(path) {
	case ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs":
		return true
	default:
		return false
	}
}

func IsTestFile(path string) bool {
	return strings.HasSuffix(path, testFileSuffix)
}

func IsBarrelFile(path string) bool {
	base := filepath.Base(path)
	return base == "index.ts" || base == "index.tsx"
}

func ResolveSourceDir(packageDir string) string {
	return filepath.Join(packageDir, sourceDirName)
}

func ResolveExistingPackageSourceDir(rootDir string, packageName string) (string, error) {
	sourceDir := ResolveSourceDir(filepath.Join(rootDir, packageName))
	if _, err := os.Stat(sourceDir); err != nil {
		if os.IsNotExist(err) {
			return "", fmt.Errorf(
				"lib package %q not found. expected %s",
				packageName,
				filepath.Join("lib", packageName, sourceDirName),
			)
		}
		return "", err
	}

	return sourceDir, nil
}
