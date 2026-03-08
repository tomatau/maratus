package initflow

import (
	"strings"

	"github.com/manifoldco/promptui"
)

type optionItem struct {
	Kind        string
	Value       string
	Label       string
	Description string

	LabelPadded string
	DescStyled  string
}

func prepareOptionItems(items []optionItem) []optionItem {
	maxLabel := 0
	for _, item := range items {
		if len(item.Label) > maxLabel {
			maxLabel = len(item.Label)
		}
	}

	prepared := make([]optionItem, len(items))
	for i, item := range items {
		item.LabelPadded = padRight(item.Label, maxLabel+2)
		item.DescStyled = styleMuted(item.Description)
		prepared[i] = item
	}
	return prepared
}

func selectOption(label string, items []optionItem, size int) (int, optionItem, error) {
	prepared := prepareOptionItems(items)

	searcher := func(input string, index int) bool {
		query := strings.ToLower(strings.TrimSpace(input))
		item := prepared[index]
		return strings.Contains(strings.ToLower(item.Label), query) ||
			strings.Contains(strings.ToLower(item.Value), query) ||
			strings.Contains(strings.ToLower(item.Description), query)
	}

	selectPrompt := promptui.Select{
		Label: styleAqua(label),
		Items: prepared,
		Templates: &promptui.SelectTemplates{
			Label:    "{{ . }}",
			Active:   "▸ {{ .LabelPadded }} {{ .DescStyled }}",
			Inactive: "  {{ .LabelPadded }} {{ .DescStyled }}",
			Selected: "✓ {{ .Label }}",
		},
		Size:              size,
		Searcher:          searcher,
		StartInSearchMode: true,
		HideHelp:          true,
		CursorPos:         0,
	}

	index, _, err := selectPrompt.Run()
	if err != nil {
		return 0, optionItem{}, err
	}
	if index < 0 || index >= len(prepared) {
		return -1, optionItem{}, nil
	}
	return index, prepared[index], nil
}

func padRight(value string, width int) string {
	if len(value) >= width {
		return value
	}
	return value + strings.Repeat(" ", width-len(value))
}
