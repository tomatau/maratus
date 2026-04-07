package project

import (
	"maratus/cli/internal/debug"
	"os"
)

func EnsureConsumerManifest(proj Project) error {
	if proj.IsMaratusRepo {
		return nil
	}

	if _, err := os.Stat(proj.RegistryManifestPath); err == nil {
		debug.Logf("using installed manifest at %s", proj.RegistryManifestPath)
		return nil
	} else if !os.IsNotExist(err) {
		return err
	}

	debug.Logf("manifest missing at %s; installing @maratus/manifest", proj.RegistryManifestPath)
	return InstallPackages(
		proj.RootDir,
		proj.PackageManager,
		[]string{manifestScopeDirName + "/" + manifestPackageDirName},
	)
}
