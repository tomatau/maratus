package source

import (
	"path/filepath"
	"strings"
)

const testFileSuffix = ".test.ts"
const sourceDirName = "src"

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
