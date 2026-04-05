package project

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type repoConfig struct {
	Workspaces struct {
		Registry struct {
			Path string `yaml:"path"`
		} `yaml:"registry"`
		Packages struct {
			Path string `yaml:"path"`
		} `yaml:"packages"`
	} `yaml:"workspaces"`
}

func loadRepoConfig(rootDir string) (repoConfig, bool, error) {
	path := filepath.Join(rootDir, repoConfigFileName)
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return repoConfig{}, false, nil
		}
		return repoConfig{}, false, err
	}

	var cfg repoConfig
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return repoConfig{}, false, err
	}

	return cfg, true, nil
}
