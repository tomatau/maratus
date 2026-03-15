package config

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
)

type Config struct {
	SrcDir           string `json:"srcDir"`
	ComponentsDir    string `json:"componentsDir"`
	ComponentsLayout string `json:"componentsLayout"`
	Style            Style  `json:"style"`
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
	if cfg.ComponentsLayout == "" {
		cfg.ComponentsLayout = DefaultComponentsLayout()
	}
	if cfg.Style == "" {
		cfg.Style = DefaultStyle()
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
