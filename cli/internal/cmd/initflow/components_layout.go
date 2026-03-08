package initflow

import (
	"fmt"
	"strings"

	"github.com/manifoldco/promptui"
	"github.com/spf13/cobra"
)

func AskComponentsLayout(cmd *cobra.Command) (string, error) {
	const defaultLayout = "nested"

	type layoutOption struct {
		Value      string
		Label      string
		DescStyled string
	}

	if !isInteractiveSession(cmd) {
		return defaultLayout, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		styleViolet("Components layout"),
		styleMuted("Choose nested directories per component, or a flat list of files."),
	)

	items := []layoutOption{
		{
			Value:      "nested",
			Label:      "nested (default)",
			DescStyled: styleMuted("One directory per component."),
		},
		{
			Value:      "flat",
			Label:      "flat",
			DescStyled: styleMuted("Files directly in components directory."),
		},
	}
	searcher := func(input string, index int) bool {
		query := strings.ToLower(strings.TrimSpace(input))
		option := items[index]
		return strings.Contains(strings.ToLower(option.Label), query) ||
			strings.Contains(strings.ToLower(option.Value), query)
	}

	selectPrompt := promptui.Select{
		Label:             styleAqua("How should components be installed?"),
		Items:             items,
		Templates: &promptui.SelectTemplates{
			Label:    "{{ . }}",
			Active:   "▸ {{ .Label }} {{ .DescStyled }}",
			Inactive: "  {{ .Label }} {{ .DescStyled }}",
			Selected: "✓ {{ .Label }}",
		},
		Size:              2,
		Searcher:          searcher,
		StartInSearchMode: true,
		HideHelp:          true,
		CursorPos:         0,
	}

	index, _, err := selectPrompt.Run()
	if err != nil {
		return "", err
	}
	if index < 0 || index >= len(items) {
		return defaultLayout, nil
	}
	return items[index].Value, nil
}
