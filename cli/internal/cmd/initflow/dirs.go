package initflow

import (
	"bytes"
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"

	"github.com/spf13/cobra"
)

func TopLevelDirs(root string) ([]string, error) {
	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}

	var dirs []string
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			dirs = append(dirs, entry.Name())
		}
	}
	sort.Strings(dirs)

	filtered, err := filterIgnoredDirs(root, dirs)
	if err != nil {
		// Outside git repo or git unavailable: keep non-hidden dirs.
		return dirs, nil
	}
	return filtered, nil
}

func filterIgnoredDirs(root string, dirs []string) ([]string, error) {
	if len(dirs) == 0 {
		return dirs, nil
	}

	args := append([]string{"-C", root, "check-ignore"}, dirs...)
	cmd := exec.Command("git", args...)
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) && exitErr.ExitCode() == 1 {
			return dirs, nil
		}
		return nil, err
	}

	ignored := map[string]struct{}{}
	for _, line := range strings.Split(strings.TrimSpace(out.String()), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		ignored[line] = struct{}{}
	}

	filtered := make([]string, 0, len(dirs))
	for _, dir := range dirs {
		if _, isIgnored := ignored[dir]; !isIgnored {
			filtered = append(filtered, dir)
		}
	}
	return filtered, nil
}

func sourceAbsPath(srcDir string) string {
	if srcDir == "." || srcDir == "" {
		cwd, _ := os.Getwd()
		return cwd
	}
	cwd, _ := os.Getwd()
	return filepath.Join(cwd, srcDir)
}

func childDirs(root string) ([]string, error) {
	entries, err := os.ReadDir(root)
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return []string{}, nil
		}
		return nil, err
	}

	var dirs []string
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			dirs = append(dirs, entry.Name())
		}
	}
	sort.Strings(dirs)
	return dirs, nil
}

func isInteractiveSession(cmd *cobra.Command) bool {
	inFile, ok := cmd.InOrStdin().(*os.File)
	if !ok {
		return false
	}
	outFile, ok := cmd.OutOrStdout().(*os.File)
	if !ok {
		return false
	}

	inStat, err := inFile.Stat()
	if err != nil {
		return false
	}
	outStat, err := outFile.Stat()
	if err != nil {
		return false
	}

	return (inStat.Mode()&os.ModeCharDevice) != 0 && (outStat.Mode()&os.ModeCharDevice) != 0
}

func styleAqua(s string) string {
	return "\x1b[36m" + s + "\x1b[0m"
}

func styleViolet(s string) string {
	return "\x1b[38;5;183m" + s + "\x1b[0m"
}

func styleMuted(s string) string {
	return "\x1b[90m" + s + "\x1b[0m"
}
