package initflow

import (
	"fmt"
	"strings"

	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

func AskComponentsDir(cmd *cobra.Command, srcDir string) (string, error) {
	const defaultComponentsDir = "components"

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

	items := []optionItem{
		{
			Kind:        "default",
			Value:       defaultComponentsDir,
			Label:       "components",
			Description: "Use components under source.",
		},
		{
			Kind:        "custom",
			Label:       "custom",
			Description: "Create a new directory path.",
		},
	}
	for _, suggestion := range suggestions {
		if suggestion != defaultComponentsDir {
			items = append(items, optionItem{
				Kind:        "direct",
				Value:       suggestion,
				Label:       suggestion,
				Description: "Existing directory.",
			})
		}
	}

	selectedIndex, selected, err := selectOption("Select your components directory...", items, 8)
	if err != nil {
		return "", err
	}
	if selectedIndex < 0 {
		return defaultComponentsDir, nil
	}

	if selected.Kind == "default" {
		return defaultComponentsDir, nil
	}

	if selected.Kind == "custom" {
		textPrompt := promptui.Prompt{
			Label:     styleAqua("components directory"),
			AllowEdit: true,
		}
		customValue, err := textPrompt.Run()
		if err != nil {
			return "", err
		}
		customValue = strings.TrimSpace(customValue)
		if customValue == "" {
			return defaultComponentsDir, nil
		}
		return customValue, nil
	}

	value := strings.TrimSpace(selected.Value)
	if value == "" {
		return defaultComponentsDir, nil
	}
	return value, nil
}
