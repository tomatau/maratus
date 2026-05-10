package registry

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const internalLibPackagePrefix = "@maratus-lib/"
const registryComponentPackagePrefix = "@maratus-registry/"
const sourceComponentPackagePrefix = "@maratus-component/"

func SourceComponentPackageName(componentName string) string {
	return sourceComponentPackagePrefix + componentName
}

func RegistryComponentPackageName(componentName string) string {
	return registryComponentPackagePrefix + componentName
}

func LibDependencies(dependencies map[string]string) []string {
	if len(dependencies) == 0 {
		return nil
	}

	result := make([]string, 0, len(dependencies))
	for packageName := range dependencies {
		if !strings.HasPrefix(packageName, internalLibPackagePrefix) {
			continue
		}
		result = append(result, strings.TrimPrefix(packageName, internalLibPackagePrefix))
	}

	sort.Strings(result)
	return result
}

func ComponentDependencies(dependencies map[string]string) []string {
	if len(dependencies) == 0 {
		return nil
	}

	result := make([]string, 0, len(dependencies))
	for packageName := range dependencies {
		if !strings.HasPrefix(packageName, registryComponentPackagePrefix) {
			continue
		}
		result = append(result, strings.TrimPrefix(packageName, registryComponentPackagePrefix))
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

func LoadLibDependencies(packageRoot string) ([]string, error) {
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

	return LibDependencies(manifest.Dependencies), nil
}

func LoadComponentLibDependencies(componentPackageRoot string) ([]string, error) {
	manifest, err := LoadPackageManifest(componentPackageRoot)
	if err != nil {
		return nil, err
	}

	return LibDependencies(manifest.Dependencies), nil
}

func LoadComponentDependencies(componentPackageRoot string) ([]string, error) {
	manifest, err := LoadPackageManifest(componentPackageRoot)
	if err != nil {
		return nil, err
	}

	return ComponentDependencies(manifest.Dependencies), nil
}
