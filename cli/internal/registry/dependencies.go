package registry

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const internalPackagePrefix = "@maratus/"

func InternalDependencies(dependencies map[string]string) []string {
	if len(dependencies) == 0 {
		return nil
	}

	result := make([]string, 0, len(dependencies))
	for packageName := range dependencies {
		if !strings.HasPrefix(packageName, internalPackagePrefix) {
			continue
		}
		result = append(result, strings.TrimPrefix(packageName, internalPackagePrefix))
	}

	sort.Strings(result)
	return result
}

func DedupePackageNames(packageNames []string) []string {
	if len(packageNames) == 0 {
		return nil
	}

	seen := make(map[string]struct{}, len(packageNames))
	result := make([]string, 0, len(packageNames))
	for _, packageName := range packageNames {
		if _, ok := seen[packageName]; ok {
			continue
		}
		seen[packageName] = struct{}{}
		result = append(result, packageName)
	}

	sort.Strings(result)
	return result
}

func LoadInternalDependencies(packageRoot string) ([]string, error) {
	data, err := os.ReadFile(filepath.Join(packageRoot, PackageFileName))
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}

	var manifest PackageManifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return nil, err
	}

	return InternalDependencies(manifest.Dependencies), nil
}

func LoadComponentInternalDependencies(registryRoot string, componentName string) ([]string, error) {
	manifest, err := LoadPackageManifest(registryRoot, componentName)
	if err != nil {
		return nil, err
	}

	return InternalDependencies(manifest.Dependencies), nil
}
