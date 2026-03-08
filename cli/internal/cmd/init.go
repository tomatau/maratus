package cmd

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"

	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

func newInitCmd(configFilePath func() string) *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize Arachne config",
		RunE: func(cmd *cobra.Command, args []string) error {
			srcDir, err := askSourceDir(cmd)
			if err != nil {
				return err
			}

			path := configFilePath()
			if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
				return err
			}

			payload, err := json.MarshalIndent(struct {
				SrcDir string `json:"srcDir"`
			}{
				SrcDir: srcDir,
			}, "", "  ")
			if err != nil {
				return err
			}

			return os.WriteFile(path, append(payload, '\n'), 0o644)
		},
	}
}

func askSourceDir(cmd *cobra.Command) (string, error) {
	const defaultSrcDir = "src"
	const currentDirOption = "Current directory (.)"
	const customPathOption = "Enter custom path..."
	const srcDefaultOption = "src (default)"

	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	suggestions, err := topLevelDirs(cwd)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultSrcDir, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		styleViolet("Source directory"),
		styleMuted("Parent directory for config paths like components and lib."),
	)

	items := []string{srcDefaultOption, customPathOption, currentDirOption}
	for _, suggestion := range suggestions {
		if suggestion != defaultSrcDir {
			items = append(items, suggestion)
		}
	}

	defaultIndex := 0

	searcher := func(input string, index int) bool {
		query := strings.ToLower(strings.TrimSpace(input))
		item := strings.ToLower(items[index])
		return strings.Contains(item, query)
	}

	selectPrompt := promptui.Select{
		Label:             styleAqua("Select your source directory..."),
		Items:             items,
		Size:              8,
		Searcher:          searcher,
		StartInSearchMode: true,
		HideHelp:          true,
		CursorPos:         defaultIndex,
	}

	selectedIndex, selected, err := selectPrompt.Run()
	if err != nil {
		return "", err
	}

	if selected == srcDefaultOption {
		return defaultSrcDir, nil
	}

	if selectedIndex == 1 {
		textPrompt := promptui.Prompt{
			Label:     styleAqua("source directory"),
			AllowEdit: true,
		}

		selected, err = textPrompt.Run()
		if err != nil {
			return "", err
		}
	}

	if selectedIndex == 2 {
		return ".", nil
	}

	selected = strings.TrimSpace(selected)
	if selected == "" {
		return defaultSrcDir, nil
	}
	return selected, nil
}

func topLevelDirs(root string) ([]string, error) {
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
