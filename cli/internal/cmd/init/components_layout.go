package initcmd

import (
	"fmt"

	"arachne/cli/internal/config"
	"arachne/cli/internal/style"
	"github.com/spf13/cobra"
)

func AskComponentsLayout(cmd *cobra.Command) (string, error) {
	defaultLayout := config.DefaultComponentsLayout()

	if !isInteractiveSession(cmd) {
		return defaultLayout, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet("Components layout"),
		style.Muted("Choose nested directories per component, or a flat list of files."),
	)

	items := []optionItem{
		{
			Value:       config.ComponentsLayoutNested,
			Label:       config.ComponentsLayoutNested,
			Description: "One directory per component.",
		},
		{
			Value:       config.ComponentsLayoutFlat,
			Label:       config.ComponentsLayoutFlat,
			Description: "Files directly in components directory.",
		},
	}
	index, selected, err := selectOption("How should components be installed?", items, 2)
	if err != nil {
		return "", err
	}
	if index < 0 {
		printSelectedValue(cmd, defaultLayout)
		return defaultLayout, nil
	}
	printSelectedOption(cmd, selected.Label, selected.Description)
	return selected.Value, nil
}
