package initflow

import (
	"fmt"
	"os"
	"strings"

	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

func AskSourceDir(cmd *cobra.Command) (string, error) {
	const defaultSrcDir = "src"
	const currentDirOption = "Current directory (.)"
	const customPathOption = "Enter custom path..."
	const srcDefaultOption = "src (default)"

	cwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	suggestions, err := TopLevelDirs(cwd)
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
		CursorPos:         0,
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
