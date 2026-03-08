package initflow

import (
	"fmt"
	"strings"

	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

func AskComponentsDir(cmd *cobra.Command, srcDir string) (string, error) {
	const defaultComponentsDir = "components"
	const customPathOption = "Enter custom path..."
	const defaultOption = "components (default)"

	srcRoot := sourceAbsPath(srcDir)
	suggestions, err := childDirs(srcRoot)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultComponentsDir, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		styleViolet("Components directory"),
		styleMuted("Directory under source for generated component files."),
	)

	items := []string{defaultOption, customPathOption}
	for _, suggestion := range suggestions {
		if suggestion != defaultComponentsDir {
			items = append(items, suggestion)
		}
	}

	searcher := func(input string, index int) bool {
		query := strings.ToLower(strings.TrimSpace(input))
		item := strings.ToLower(items[index])
		return strings.Contains(item, query)
	}

	selectPrompt := promptui.Select{
		Label:             styleAqua("Select your components directory..."),
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

	if selected == defaultOption {
		return defaultComponentsDir, nil
	}

	if selectedIndex == 1 {
		textPrompt := promptui.Prompt{
			Label:     styleAqua("components directory"),
			AllowEdit: true,
		}
		selected, err = textPrompt.Run()
		if err != nil {
			return "", err
		}
	}

	selected = strings.TrimSpace(selected)
	if selected == "" {
		return defaultComponentsDir, nil
	}
	return selected, nil
}
