package project

import (
	"maratus/cli/internal/config"
	"path/filepath"
)

type Project struct {
	RootDir              string
	ConfigPath           string
	Config               config.Config
	RegistryRoot         string
	RegistryManifestPath string
	IsMaratusRepo        bool
	ComponentsDir        string
	LibDir               string
}

func Open(rootDir string, configFilePath string) (Project, error) {
	resolvedConfigPath := ResolveConfigPath(rootDir, configFilePath)
	cfg, err := config.Load(resolvedConfigPath)
	if err != nil {
		return Project{}, err
	}

	repoCfg, isMaratusRepo, err := loadRepoConfig(rootDir)
	if err != nil {
		return Project{}, err
	}

	registryRoot := ""
	registryManifestPath := filepath.Join(
		rootDir,
		nodeModulesDirName,
		manifestScopeDirName,
		manifestPackageDirName,
		manifestDistDirName,
		manifestFileName,
	)
	if isMaratusRepo {
		registryManifestPath = filepath.Join(
			rootDir,
			repoCfg.Workspaces.Packages.Path,
			localManifestPackageDir,
			manifestDistDirName,
			manifestFileName,
		)
		registryRoot = filepath.Join(rootDir, repoCfg.Workspaces.Registry.Path)
	}

	return Project{
		RootDir:              rootDir,
		ConfigPath:           resolvedConfigPath,
		Config:               cfg,
		RegistryRoot:         registryRoot,
		RegistryManifestPath: registryManifestPath,
		IsMaratusRepo:        isMaratusRepo,
		ComponentsDir:        ResolveComponentsDir(resolvedConfigPath, cfg),
		LibDir:               ResolveLibDir(resolvedConfigPath, cfg),
	}, nil
}
