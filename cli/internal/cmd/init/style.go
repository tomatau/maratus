package initcmd

import (
	"fmt"

	"arachne/cli/internal/config"
	"arachne/cli/internal/style"
	"github.com/spf13/cobra"
)

func AskStyle(cmd *cobra.Command) (string, error) {
	defaultStyle := config.DefaultStyle()

	if !isInteractiveSession(cmd) {
		return defaultStyle, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet("Style mode"),
		style.Muted("Choose how component styles are installed in your project."),
	)

	items := []optionItem{
		{
			Value:       config.StyleInlineCSSVars,
			Label:       config.StyleInlineCSSVars,
			Description: "Inline style object with CSS variable hooks. (default)",
		},
		{
			Value:       config.StyleCSSFiles,
			Label:       config.StyleCSSFiles,
			Description: "Separate .css file imported by the component.",
		},
	}
	index, selected, err := selectOption("How should component styles be added?", items, 2)
	if err != nil {
		return "", err
	}
	if index < 0 {
		printSelectedValue(cmd, defaultStyle)
		return defaultStyle, nil
	}
	printSelectedOption(cmd, selected.Label, selected.Description)

	return selected.Value, nil
}
