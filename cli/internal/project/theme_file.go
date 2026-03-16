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
	tailwindThemeBlockPattern = regexp.MustCompile(`(?s)^\s*(?:/\*.*?\*/\s*)?@theme\s+inline\s*\{\s*(.*?)\s*\}\s*$`)
	cssThemeBlockPattern      = regexp.MustCompile(`(?s)^\s*(?:/\*.*?\*/\s*)?@layer\s+theme\s*\{\s*:root\s*\{\s*(.*?)\s*\}\s*\}\s*$`)
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

func UpdateThemeFile(configPath string, cfg config.Config, manifest ComponentsManifest) (string, bool, error) {
	values := collectThemeTokenValues(manifest)
	path := ThemeFilePath(configPath, cfg)
	created := false

	if existingValues, err := readExistingThemeValues(path, cfg.Style); err != nil {
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

	if err := os.WriteFile(path, []byte(renderThemeFile(cfg.Style, values)), 0o644); err != nil {
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

func readExistingThemeValues(path string, themeStyle config.Style) (map[string]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]string{}, nil
		}
		return nil, err
	}

	source := string(data)
	matches := themeBlockPattern(themeStyle).FindStringSubmatch(source)
	if matches == nil {
		return nil, fmt.Errorf("%s must contain exactly one supported theme block", path)
	}

	values := map[string]string{}
	for _, match := range themeDeclarationPattern.FindAllStringSubmatch(matches[1], -1) {
		values[match[1]] = strings.TrimSpace(match[2])
	}
	return values, nil
}

func renderThemeFile(themeStyle config.Style, values map[string]string) string {
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
	builder.WriteString("- Keep this file to a single ")
	builder.WriteString(themeBlockDescription(themeStyle))
	builder.WriteString(".\n")
	builder.WriteString("- Replace initial values with theme values for your project.\n")
	builder.WriteString("- Tokens left as initial are excluded from the final CSS output.\n")
	builder.WriteString("*/\n")
	builder.WriteString(themeBlockOpen(themeStyle))
	declarationIndent := "  "
	if themeStyle == config.StyleCSSFiles || themeStyle == config.StyleCSSModules {
		declarationIndent = "    "
	}
	for _, token := range tokens {
		builder.WriteString(declarationIndent)
		builder.WriteString(token)
		builder.WriteString(": ")
		builder.WriteString(values[token])
		builder.WriteString(";\n")
	}
	builder.WriteString(themeBlockClose(themeStyle))

	return builder.String()
}

func themeBlockPattern(themeStyle config.Style) *regexp.Regexp {
	if themeStyle == config.StyleCSSFiles || themeStyle == config.StyleCSSModules {
		return cssThemeBlockPattern
	}
	return tailwindThemeBlockPattern
}

func themeBlockDescription(themeStyle config.Style) string {
	if themeStyle == config.StyleCSSFiles || themeStyle == config.StyleCSSModules {
		return "@layer theme { :root { ... } } block"
	}
	return "@theme inline block"
}

func themeBlockOpen(themeStyle config.Style) string {
	if themeStyle == config.StyleCSSFiles || themeStyle == config.StyleCSSModules {
		return "@layer theme {\n  :root {\n"
	}
	return "@theme inline {\n"
}

func themeBlockClose(themeStyle config.Style) string {
	if themeStyle == config.StyleCSSFiles || themeStyle == config.StyleCSSModules {
		return "  }\n}\n"
	}
	return "}\n"
}
