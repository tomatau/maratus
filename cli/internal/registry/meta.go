package registry

import (
	"encoding/json"
	"os"
	"path/filepath"
)

const MetaFileName = "meta.json"
const PackageFileName = "package.json"

type ComponentTokenMapping struct {
	Component string `json:"component"`
	Theme     string `json:"theme"`
}

type ComponentMeta struct {
	ThemeTokens     []string                `json:"themeTokens"`
	ComponentTokens []ComponentTokenMapping `json:"componentTokens"`
}

type PackageManifest struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

func LoadComponentMeta(registryRoot string, componentName string) (ComponentMeta, error) {
	data, err := os.ReadFile(filepath.Join(registryRoot, componentName, MetaFileName))
	if err != nil {
		return ComponentMeta{}, err
	}

	var meta ComponentMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return ComponentMeta{}, err
	}

	return meta, nil
}

func LoadPackageManifest(registryRoot string, componentName string) (PackageManifest, error) {
	data, err := os.ReadFile(filepath.Join(registryRoot, componentName, PackageFileName))
	if err != nil {
		return PackageManifest{}, err
	}

	var manifest PackageManifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return PackageManifest{}, err
	}

	return manifest, nil
}
