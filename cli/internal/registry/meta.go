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
	Name             string            `json:"name"`
	Version          string            `json:"version"`
	Dependencies     map[string]string `json:"dependencies"`
	PeerDependencies map[string]string `json:"peerDependencies"`
}

func LoadComponentMeta(componentPackageRoot string) (ComponentMeta, error) {
	data, err := os.ReadFile(filepath.Join(componentPackageRoot, MetaFileName))
	if err != nil {
		return ComponentMeta{}, err
	}

	var meta ComponentMeta
	if err := json.Unmarshal(data, &meta); err != nil {
		return ComponentMeta{}, err
	}

	return meta, nil
}

func LoadPackageManifest(packageRoot string) (PackageManifest, error) {
	data, err := os.ReadFile(filepath.Join(packageRoot, PackageFileName))
	if err != nil {
		return PackageManifest{}, err
	}

	var manifest PackageManifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return PackageManifest{}, err
	}

	return manifest, nil
}
