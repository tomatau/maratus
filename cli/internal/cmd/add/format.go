package addcmd

import (
	"arachne/cli/internal/project"
	"os/exec"
	"sort"
	"strings"
)

func shouldRunFormatCommand(proj project.Project) bool {
	command := strings.TrimSpace(proj.Config.FormatCommand)
	return command != "" && command != ":"
}

func runFormatCommand(
	proj project.Project,
	results []InstallResult,
	dependencyResults []DependencyInstallResult,
	themeFilePath string,
) {
	if proj.Config.FormatCommand == "" {
		return
	}

	files := touchedOutputFiles(results, dependencyResults, themeFilePath)
	if len(files) == 0 {
		return
	}

	command := exec.Command(
		"sh",
		"-c",
		proj.Config.FormatCommand+" \"$@\"",
		"sh",
	)
	command.Args = append(command.Args, files...)
	command.Dir = proj.RootDir
	_ = command.Run()
}

func touchedOutputFiles(
	results []InstallResult,
	dependencyResults []DependencyInstallResult,
	themeFilePath string,
) []string {
	seen := map[string]struct{}{}
	files := make([]string, 0)

	appendFile := func(path string) {
		if path == "" {
			return
		}
		if _, ok := seen[path]; ok {
			return
		}
		seen[path] = struct{}{}
		files = append(files, path)
	}

	for _, result := range results {
		for _, file := range result.Files {
			appendFile(file)
		}
	}
	for _, result := range dependencyResults {
		for _, file := range result.Files {
			appendFile(file)
		}
	}
	appendFile(themeFilePath)

	sort.Strings(files)
	return files
}
