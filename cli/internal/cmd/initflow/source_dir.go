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

	items := []optionItem{
		{
			Kind:        "default",
			Value:       defaultSrcDir,
			Label:       "src",
			Description: "Use src as the source root.",
		},
		{
			Kind:        "custom",
			Label:       "custom",
			Description: "Create a new directory path.",
		},
		{
			Kind:        "direct",
			Value:       ".",
			Label:       ".",
			Description: "Current directory.",
		},
	}
	for _, suggestion := range suggestions {
		if suggestion != defaultSrcDir {
			items = append(items, optionItem{
				Kind:        "direct",
				Value:       suggestion,
				Label:       suggestion,
				Description: "Existing directory.",
			})
		}
	}

	selectedIndex, selected, err := selectOption("Select your source directory...", items, 8)
	if err != nil {
		return "", err
	}
	if selectedIndex < 0 {
		return defaultSrcDir, nil
	}

	if selected.Kind == "default" {
		return defaultSrcDir, nil
	}

	if selected.Kind == "custom" {
		textPrompt := promptui.Prompt{
			Label:     styleAqua("source directory"),
			AllowEdit: true,
		}

		customValue, err := textPrompt.Run()
		if err != nil {
			return "", err
		}
		customValue = strings.TrimSpace(customValue)
		if customValue == "" {
			return defaultSrcDir, nil
		}
		return customValue, nil
	}

	value := strings.TrimSpace(selected.Value)
	if value == "" {
		return defaultSrcDir, nil
	}
	return value, nil
}
