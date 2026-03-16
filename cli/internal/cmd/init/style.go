package initcmd

import (
	"fmt"

	"arachne/cli/internal/config"
	"arachne/cli/internal/style"

	"github.com/spf13/cobra"
)

func AskStyle(cmd *cobra.Command) (config.Style, error) {
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
			Value:       string(config.StyleCSSFiles),
			Label:       string(config.StyleCSSFiles),
			Description: "Separate .css file imported by the component. (default)",
		},
		{
			Value:       string(config.StyleTailwindCSS),
			Label:       string(config.StyleTailwindCSS),
			Description: "Tailwind-layered CSS file imported by the component.",
		},
	}
	index, selected, err := selectOption("How should component styles be added?", items, 0)
	if err != nil {
		return "", err
	}
	if index < 0 {
		printSelectedValue(cmd, string(defaultStyle))
		return defaultStyle, nil
	}
	printSelectedOption(cmd, selected.Label, selected.Description)

	parsedStyle, ok := config.ParseStyle(selected.Value)
	if !ok {
		return "", fmt.Errorf("unsupported style: %s", selected.Value)
	}

	return parsedStyle, nil
}
