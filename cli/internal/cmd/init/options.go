package initcmd

import (
	"fmt"
	"strings"

	"maratus/cli/internal/style"
	"maratus/cli/internal/tui"

	tea "github.com/charmbracelet/bubbletea"
)

type optionItem struct {
	Kind        string
	Value       string
	Label       string
	Description string
}

func selectOption(label string, items []optionItem, size int) (int, optionItem, error) {
	model := &optionSelectModel{
		label: label,
		items: items,
		size:  size,
	}
	program := tea.NewProgram(model)
	finalModel, err := program.Run()
	if err != nil {
		return 0, optionItem{}, err
	}

	resultModel, ok := finalModel.(*optionSelectModel)
	if !ok {
		return 0, optionItem{}, fmt.Errorf("unexpected option select model type")
	}
	if resultModel.cancelled {
		return 0, optionItem{}, fmt.Errorf("selection cancelled")
	}
	if resultModel.selectedIndex < 0 || resultModel.selectedIndex >= len(items) {
		return -1, optionItem{}, nil
	}
	return resultModel.selectedIndex, items[resultModel.selectedIndex], nil
}

type optionSelectModel struct {
	label         string
	items         []optionItem
	size          int
	query         string
	cursor        int
	done          bool
	cancelled     bool
	selectedIndex int
}

func (m *optionSelectModel) Init() tea.Cmd {
	m.selectedIndex = -1
	return nil
}

func (m *optionSelectModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	keyMsg, ok := msg.(tea.KeyMsg)
	if !ok {
		return m, nil
	}
	action, typed := tui.DecodeKeyAction(keyMsg)

	switch action {
	case tui.KeyActionCancel:
		m.cancelled = true
		return m, tea.Quit
	case tui.KeyActionUp, tui.KeyActionDown:
		m.cursor = tui.MoveCursor(m.cursor, len(m.filteredIndexes()), action)
	case tui.KeyActionAutocomplete:
		m.autocomplete()
		m.clampCursor()
	case tui.KeyActionBackspace, tui.KeyActionClear, tui.KeyActionType:
		m.query = tui.ApplyTextInput(m.query, action, typed)
		if action == tui.KeyActionClear {
			m.cursor = 0
		}
		m.clampCursor()
	case tui.KeyActionConfirm:
		filtered := m.filteredIndexes()
		if len(filtered) > 0 {
			m.selectedIndex = filtered[m.cursor]
			m.done = true
		}
		return m, tea.Quit
	}

	return m, nil
}

func (m *optionSelectModel) View() string {
	if m.done && m.selectedIndex >= 0 && m.selectedIndex < len(m.items) {
		item := m.items[m.selectedIndex]
		return style.PromptCursor() + style.PromptActive(item.Label) + "  " + style.PromptHint(item.Description)
	}

	var b strings.Builder
	b.WriteString(style.PromptFieldLabel(m.label))
	b.WriteString("\n")
	b.WriteString(style.PromptHint("Type to filter, arrows to choose, enter to confirm."))
	b.WriteString("\n\n")

	filtered := m.filteredIndexes()
	if len(filtered) == 0 {
		b.WriteString(style.PromptHint("No matches. Clear input or type another value."))
		return b.String()
	}

	limit := len(filtered)
	if m.size > 0 && m.size < limit {
		limit = m.size
	}

	maxLabelWidth := 0
	for i := 0; i < limit; i++ {
		item := m.items[filtered[i]]
		if len(item.Label) > maxLabelWidth {
			maxLabelWidth = len(item.Label)
		}
	}

	for i := 0; i < limit; i++ {
		item := m.items[filtered[i]]
		prefix := "  "
		label := item.Label
		if i == m.cursor {
			prefix = style.PromptCursor()
			label = style.PromptActive(label)
		}

		padding := strings.Repeat(" ", tui.MaxInt(1, maxLabelWidth-len(item.Label)+2))
		b.WriteString(prefix)
		b.WriteString(label)
		b.WriteString(padding)
		b.WriteString(style.PromptHint(item.Description))
		b.WriteString("\n")
	}

	return strings.TrimRight(b.String(), "\n")
}

func (m *optionSelectModel) filteredIndexes() []int {
	query := strings.ToLower(strings.TrimSpace(m.query))
	out := make([]int, 0, len(m.items))
	for i, item := range m.items {
		if query == "" ||
			strings.Contains(strings.ToLower(item.Label), query) ||
			strings.Contains(strings.ToLower(item.Value), query) ||
			strings.Contains(strings.ToLower(item.Description), query) {
			out = append(out, i)
		}
	}
	return out
}

func (m *optionSelectModel) clampCursor() {
	filtered := m.filteredIndexes()
	if len(filtered) == 0 {
		m.cursor = 0
		return
	}
	if m.cursor < 0 {
		m.cursor = 0
	}
	if m.cursor >= len(filtered) {
		m.cursor = len(filtered) - 1
	}
}

func (m *optionSelectModel) autocomplete() {
	filtered := m.filteredIndexes()
	if len(filtered) == 0 {
		return
	}
	query := strings.TrimSpace(m.query)
	if query == "" {
		m.query = m.items[filtered[m.cursor]].Label
		return
	}

	matches := make([]string, 0, len(filtered))
	for _, index := range filtered {
		matches = append(matches, m.items[index].Label)
	}
	m.query = tui.LongestCommonPrefix(matches)
}
