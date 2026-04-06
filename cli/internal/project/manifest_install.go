package project

import "os"

func EnsureConsumerManifest(proj Project) error {
	if proj.IsMaratusRepo {
		return nil
	}

	if _, err := os.Stat(proj.RegistryManifestPath); err == nil {
		return nil
	} else if !os.IsNotExist(err) {
		return err
	}

	return InstallPackages(
		proj.RootDir,
		proj.PackageManager,
		[]string{manifestScopeDirName + "/" + manifestPackageDirName},
	)
}
