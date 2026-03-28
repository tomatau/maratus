package config

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
)

type Config struct {
	SrcDir        string          `json:"srcDir"`
	ComponentsDir string          `json:"componentsDir"`
	LibDir        string          `json:"libDir"`
	ThemeDir      string          `json:"themeDir"`
	FormatCommand string          `json:"formatCommand,omitempty"`
	Layout        LayoutConfig    `json:"layout"`
	FileNames     FileNamesConfig `json:"filenames"`
	Style         Style           `json:"style"`
}

type LayoutConfig struct {
	Kind   LayoutKind `json:"kind"`
	Barrel bool       `json:"barrel"`
}

type FileNamesConfig struct {
	Lib        FileNameKind `json:"lib"`
	Hooks      FileNameKind `json:"hooks,omitempty"`
	Components FileNameKind `json:"components,omitempty"`
}

func Load(path string) (Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return Config{}, err
	}

	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return Config{}, err
	}

	if cfg.ComponentsDir == "" {
		return Config{}, errors.New("componentsDir is required in arachne.json")
	}
	if cfg.LibDir == "" {
		cfg.LibDir = "lib"
	}
	if cfg.ThemeDir == "" {
		cfg.ThemeDir = "styles"
	}
	if cfg.Layout.Kind == "" {
		cfg.Layout.Kind = DefaultLayoutKind()
	}
	if !cfg.Layout.Kind.IsValid() {
		return Config{}, errors.New("layout.kind must be one of: nested, flat")
	}
	if cfg.FileNames.Lib == "" {
		cfg.FileNames.Lib = DefaultFileNameKind()
	}
	if !cfg.FileNames.Lib.IsValid() {
		return Config{}, errors.New("filenames.lib must be one of: kebab-case, match-export")
	}
	if cfg.FileNames.Hooks == "" {
		cfg.FileNames.Hooks = DefaultFileNameKind()
	}
	if !cfg.FileNames.Hooks.IsValid() {
		return Config{}, errors.New("filenames.hooks must be one of: kebab-case, match-export")
	}
	if cfg.FileNames.Components == "" {
		cfg.FileNames.Components = FileNameKindMatchExport
	}
	if !cfg.FileNames.Components.IsValid() {
		return Config{}, errors.New("filenames.components must be one of: kebab-case, match-export")
	}
	if cfg.Style == "" {
		cfg.Style = DefaultStyle()
	}
	if !cfg.Style.IsValid() {
		return Config{}, errors.New("style must be one of: css-files, css-modules, tailwind-css")
	}

	return cfg, nil
}

func Save(path string, cfg Config) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	payload, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, append(payload, '\n'), 0o644)
}
