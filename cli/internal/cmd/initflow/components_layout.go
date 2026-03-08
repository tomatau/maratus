package initflow

import (
	"fmt"

	"github.com/spf13/cobra"
)

func AskComponentsLayout(cmd *cobra.Command) (string, error) {
	const defaultLayout = "nested"

	if !isInteractiveSession(cmd) {
		return defaultLayout, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		styleViolet("Components layout"),
		styleMuted("Choose nested directories per component, or a flat list of files."),
	)

	items := []optionItem{
		{
			Value:       "nested",
			Label:       "nested",
			Description: "One directory per component.",
		},
		{
			Value:       "flat",
			Label:       "flat",
			Description: "Files directly in components directory.",
		},
	}
	index, selected, err := selectOption("How should components be installed?", items, 2)
	if err != nil {
		return "", err
	}
	if index < 0 {
		return defaultLayout, nil
	}
	return selected.Value, nil
}
