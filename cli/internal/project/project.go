package project

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/registry"
)

type Project struct {
	RootDir       string
	ConfigPath    string
	Config        config.Config
	RegistryRoot  string
	ComponentsDir string
}

func Open(rootDir string, configFilePath string) (Project, error) {
	resolvedConfigPath := ResolveConfigPath(rootDir, configFilePath)
	cfg, err := config.Load(resolvedConfigPath)
	if err != nil {
		return Project{}, err
	}

	return Project{
		RootDir:       rootDir,
		ConfigPath:    resolvedConfigPath,
		Config:        cfg,
		RegistryRoot:  registry.ResolveRoot(rootDir),
		ComponentsDir: ResolveComponentsDir(resolvedConfigPath, cfg),
	}, nil
}
