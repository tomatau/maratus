package project

import (
	"encoding/json"
	"os"
	"path/filepath"

	"arachne/cli/internal/config"
	"arachne/cli/internal/registry"
)

const ComponentsManifestFileName = "arachne-components.json"

type InstalledComponent struct {
	Package         string                           `json:"package"`
	Version         string                           `json:"version"`
	Style           config.Style                     `json:"style"`
	ThemeTokens     []string                         `json:"themeTokens"`
	ComponentTokens []registry.ComponentTokenMapping `json:"componentTokens"`
}

type ComponentsManifest struct {
	Version    int                           `json:"version"`
	Components map[string]InstalledComponent `json:"components"`
}

func ComponentsManifestPath(configPath string) string {
	return filepath.Join(filepath.Dir(configPath), ComponentsManifestFileName)
}

func LoadComponentsManifest(configPath string) (ComponentsManifest, error) {
	path := ComponentsManifestPath(configPath)
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return ComponentsManifest{
				Version:    1,
				Components: map[string]InstalledComponent{},
			}, nil
		}
		return ComponentsManifest{}, err
	}

	var manifest ComponentsManifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return ComponentsManifest{}, err
	}
	if manifest.Version == 0 {
		manifest.Version = 1
	}
	if manifest.Components == nil {
		manifest.Components = map[string]InstalledComponent{}
	}

	return manifest, nil
}

func SaveComponentsManifest(configPath string, manifest ComponentsManifest) error {
	path := ComponentsManifestPath(configPath)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	payload, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, append(payload, '\n'), 0o644)
}
