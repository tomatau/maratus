package project

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/registry"
)

type Project struct {
	RootDir       string
	Config        config.Config
	RegistryRoot  string
	ComponentsDir string
}

func Open(rootDir string, configFilePath string) (Project, error) {
	cfg, err := config.Load(configFilePath)
	if err != nil {
		return Project{}, err
	}

	return Project{
		RootDir:       rootDir,
		Config:        cfg,
		RegistryRoot:  registry.ResolveRoot(rootDir),
		ComponentsDir: ResolveComponentsDir(cfg),
	}, nil
}
