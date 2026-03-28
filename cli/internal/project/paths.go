package project

import (
	"arachne/cli/internal/config"
	"path/filepath"
	"strings"
)

func ResolveComponentDir(proj Project, componentName string) string {
	componentDir := proj.ComponentsDir
	if proj.Config.Layout.Kind == config.LayoutKindNested {
		return filepath.Join(componentDir, componentName)
	}

	return componentDir
}

func ResolveLibPackageDir(proj Project, packageName string) string {
	return filepath.Join(proj.LibDir, packageName)
}

func RewriteComponentRelativePath(relativePath string, naming config.FileNameKind) string {
	if naming != config.FileNameKindKebabCase {
		return relativePath
	}

	return RewriteSourceRelativePath(relativePath)
}

func RewriteLibRelativePath(relativePath string, naming config.FileNameKind) string {
	if naming != config.FileNameKindKebabCase {
		return relativePath
	}

	return RewriteSourceRelativePath(relativePath)
}

func RewriteSourceRelativePath(relativePath string) string {
	dir := filepath.Dir(relativePath)
	base := filepath.Base(relativePath)
	ext := filepath.Ext(base)
	name := strings.TrimSuffix(base, ext)

	if name == "index" || name == "" {
		return relativePath
	}

	rewritten := toKebabCase(name) + ext
	if dir == "." {
		return rewritten
	}

	return filepath.Join(dir, rewritten)
}

func toKebabCase(value string) string {
	if value == "" {
		return value
	}

	var builder strings.Builder
	for i, r := range value {
		if r >= 'A' && r <= 'Z' {
			if i > 0 {
				builder.WriteByte('-')
			}
			builder.WriteRune(r + ('a' - 'A'))
			continue
		}

		builder.WriteRune(r)
	}

	return builder.String()
}
