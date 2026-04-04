package project

import (
	"maratus/cli/internal/config"
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

func RewriteComponentRelativePath(relativePath string, componentName string, naming config.FileNameKind) string {
	if naming == config.FileNameKindKebabCase {
		return RewriteSourceRelativePath(relativePath)
	}

	return rewriteComponentMatchExportRelativePath(relativePath, componentName)
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

func rewriteComponentMatchExportRelativePath(relativePath string, componentName string) string {
	dir := filepath.Dir(relativePath)
	base := filepath.Base(relativePath)

	switch base {
	case componentName + ".css":
		if dir == "." {
			return ComponentMatchExportName(componentName) + ".css"
		}
		return filepath.Join(dir, ComponentMatchExportName(componentName)+".css")
	case strings.ReplaceAll(componentName, "-", "") + ".css":
		if dir == "." {
			return ComponentMatchExportName(componentName) + ".css"
		}
		return filepath.Join(dir, ComponentMatchExportName(componentName)+".css")
	case componentName + ".module.css":
		if dir == "." {
			return ComponentMatchExportName(componentName) + ".module.css"
		}
		return filepath.Join(dir, ComponentMatchExportName(componentName)+".module.css")
	case strings.ReplaceAll(componentName, "-", "") + ".module.css":
		if dir == "." {
			return ComponentMatchExportName(componentName) + ".module.css"
		}
		return filepath.Join(dir, ComponentMatchExportName(componentName)+".module.css")
	default:
		return relativePath
	}
}

func ComponentMatchExportName(componentName string) string {
	if componentName == "" {
		return ""
	}

	parts := strings.Split(componentName, "-")
	var builder strings.Builder
	for _, part := range parts {
		if part == "" {
			continue
		}

		builder.WriteString(strings.ToUpper(part[:1]))
		if len(part) > 1 {
			builder.WriteString(part[1:])
		}
	}

	return builder.String()
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
