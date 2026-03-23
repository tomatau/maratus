package project

import (
	"arachne/cli/internal/config"
	"os"
	"path/filepath"
)

func ResolveConfigPath(cwd string, path string) string {
	if filepath.IsAbs(path) {
		return filepath.Clean(path)
	}

	return filepath.Clean(filepath.Join(cwd, path))
}

func NormalizeConfigForPath(cwd string, configPath string, cfg config.Config) (config.Config, error) {
	configDir := filepath.Dir(ResolveConfigPath(cwd, configPath))

	srcDir, err := relativizeToConfigDir(configDir, configDir, cfg.SrcDir)
	if err != nil {
		return config.Config{}, err
	}
	componentsDir, err := relativizeToConfigDir(configDir, configDir, cfg.ComponentsDir)
	if err != nil {
		return config.Config{}, err
	}
	libDir, err := relativizeToConfigDir(configDir, configDir, cfg.LibDir)
	if err != nil {
		return config.Config{}, err
	}

	cfg.SrcDir = srcDir
	cfg.ComponentsDir = componentsDir
	cfg.LibDir = libDir
	return cfg, nil
}

func ResolvePathFromConfig(configPath string, path string) string {
	cleanPath := filepath.Clean(path)
	if cleanPath == "" || cleanPath == "." {
		return cleanPath
	}
	if filepath.IsAbs(cleanPath) {
		return cleanPath
	}

	configDir := filepath.Dir(filepath.Clean(configPath))
	return filepath.Clean(filepath.Join(configDir, cleanPath))
}

func ResolveComponentsDir(configPath string, cfg config.Config) string {
	componentsDir := filepath.Clean(cfg.ComponentsDir)
	if filepath.IsAbs(componentsDir) {
		return componentsDir
	}

	srcDir := filepath.Clean(cfg.SrcDir)
	if srcDir == "" || srcDir == "." {
		return ResolvePathFromConfig(configPath, componentsDir)
	}

	prefix := srcDir + string(os.PathSeparator)
	if componentsDir == srcDir || hasPathPrefix(componentsDir, prefix) {
		return ResolvePathFromConfig(configPath, componentsDir)
	}

	return ResolvePathFromConfig(configPath, filepath.Join(srcDir, componentsDir))
}

func ResolveLibDir(configPath string, cfg config.Config) string {
	libDir := filepath.Clean(cfg.LibDir)
	if filepath.IsAbs(libDir) {
		return libDir
	}

	srcDir := filepath.Clean(cfg.SrcDir)
	if srcDir == "" || srcDir == "." {
		return ResolvePathFromConfig(configPath, libDir)
	}

	prefix := srcDir + string(os.PathSeparator)
	if libDir == srcDir || hasPathPrefix(libDir, prefix) {
		return ResolvePathFromConfig(configPath, libDir)
	}

	return ResolvePathFromConfig(configPath, filepath.Join(srcDir, libDir))
}

func relativizeToConfigDir(cwd string, configDir string, path string) (string, error) {
	cleanPath := filepath.Clean(path)
	if cleanPath == "" || cleanPath == "." {
		return cleanPath, nil
	}
	if filepath.IsAbs(cleanPath) {
		return cleanPath, nil
	}

	absolutePath := filepath.Join(cwd, cleanPath)
	relativePath, err := filepath.Rel(configDir, absolutePath)
	if err != nil {
		return "", err
	}
	if relativePath == "." {
		return "", nil
	}

	return relativePath, nil
}

func hasPathPrefix(path string, prefix string) bool {
	return len(path) >= len(prefix) && path[:len(prefix)] == prefix
}
