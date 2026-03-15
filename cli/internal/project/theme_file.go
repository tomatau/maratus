package project

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"

	"arachne/cli/internal/config"
)

const ThemeFileName = "arachne-theme.css"

var (
	themeBlockPattern       = regexp.MustCompile(`(?s)^\s*(?:/\*.*?\*/\s*)?@theme\s+inline\s*\{\s*(.*?)\s*\}\s*$`)
	themeDeclarationPattern = regexp.MustCompile(`(?m)^\s*(--[A-Za-z0-9_-]+)\s*:\s*([^;]+);\s*$`)
)

func ThemeFilePath(configPath string, cfg config.Config) string {
	baseDir := ResolvePathFromConfig(configPath, cfg.SrcDir)
	if cfg.SrcDir == "" || cfg.SrcDir == "." {
		baseDir = filepath.Dir(configPath)
	}

	themeDir := filepath.Clean(cfg.ThemeDir)
	if themeDir == "" || themeDir == "." {
		return filepath.Join(baseDir, ThemeFileName)
	}

	if filepath.IsAbs(themeDir) {
		return filepath.Join(themeDir, ThemeFileName)
	}

	return filepath.Join(baseDir, themeDir, ThemeFileName)
}

func UpdateTailwindThemeFile(configPath string, cfg config.Config, manifest ComponentsManifest) (string, bool, error) {
	values := collectThemeTokenValues(manifest)
	path := ThemeFilePath(configPath, cfg)
	created := false

	if existingValues, err := readExistingThemeValues(path); err != nil {
		return "", false, err
	} else {
		for token, value := range existingValues {
			if _, ok := values[token]; ok {
				values[token] = value
				continue
			}
			values[token] = value
		}
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		created = true
	} else if err != nil {
		return "", false, err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return "", false, err
	}

	if err := os.WriteFile(path, []byte(renderThemeFile(values)), 0o644); err != nil {
		return "", false, err
	}

	return path, created, nil
}

func collectThemeTokenValues(manifest ComponentsManifest) map[string]string {
	values := map[string]string{}
	for _, component := range manifest.Components {
		for _, token := range component.ThemeTokens {
			if _, ok := values[token]; !ok {
				values[token] = "initial"
			}
		}
	}
	return values
}

func readExistingThemeValues(path string) (map[string]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]string{}, nil
		}
		return nil, err
	}

	source := string(data)
	matches := themeBlockPattern.FindStringSubmatch(source)
	if matches == nil {
		return nil, fmt.Errorf("%s must contain exactly one @theme block", path)
	}

	values := map[string]string{}
	for _, match := range themeDeclarationPattern.FindAllStringSubmatch(matches[1], -1) {
		values[match[1]] = strings.TrimSpace(match[2])
	}
	return values, nil
}

func renderThemeFile(values map[string]string) string {
	tokens := make([]string, 0, len(values))
	for token := range values {
		tokens = append(tokens, token)
	}
	sort.Strings(tokens)

	var builder strings.Builder
	builder.WriteString("/*\n")
	builder.WriteString("Arachne theme tokens for installed components.\n")
	builder.WriteString("\n")
	builder.WriteString("Import this file into your stylesheet entrypoint so the tokens are included in your build.\n")
	builder.WriteString("\n")
	builder.WriteString("Constraints:\n")
	builder.WriteString("- Keep this file to a single @theme inline block.\n")
	builder.WriteString("- Replace initial values with theme values for your project.\n")
	builder.WriteString("- Tokens left as initial are excluded from the final CSS output.\n")
	builder.WriteString("*/\n")
	builder.WriteString("@theme inline {\n")
	for _, token := range tokens {
		builder.WriteString("  ")
		builder.WriteString(token)
		builder.WriteString(": ")
		builder.WriteString(values[token])
		builder.WriteString(";\n")
	}
	builder.WriteString("}\n")

	return builder.String()
}
