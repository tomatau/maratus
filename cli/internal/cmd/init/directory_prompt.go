package initcmd

import (
	"sort"
	"strings"

	"arachne/cli/internal/style"
	"arachne/cli/internal/tui"

	tea "github.com/charmbracelet/bubbletea"
)

type directoryPromptOption struct {
	Value       string
	Description string
}

type directoryPromptModel struct {
	defaultValue string
	options      []directoryPromptOption
	existingDirs []string
	query        string
	cursor       int
	cursorBlink  bool
	done         bool
	cancelled    bool
	chosenValue  string
}

func newDirectoryPromptModel(defaultValue string, options []directoryPromptOption, existingDirs []string) *directoryPromptModel {
	return &directoryPromptModel{
		defaultValue: defaultValue,
		options:      options,
		existingDirs: existingDirs,
	}
}

func (m *directoryPromptModel) Init() tea.Cmd {
	m.cursorBlink = true
	return tui.CursorBlinkCmd()
}

func (m *directoryPromptModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg.(type) {
	case tui.CursorBlinkMsg:
		m.cursorBlink = !m.cursorBlink
		return m, tui.CursorBlinkCmd()
	}

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
		m.cursor = tui.MoveCursor(m.cursor, len(m.filteredOptions()), action)
	case tui.KeyActionAutocomplete:
		m.autocomplete()
		m.clampCursor()
	case tui.KeyActionBackspace, tui.KeyActionClear, tui.KeyActionType:
		m.query = tui.ApplyTextInput(m.query, action, typed)
		m.cursorBlink = true
		if action == tui.KeyActionClear {
			m.chosenValue = ""
			m.cursor = 0
		}
		m.clampCursor()
	case tui.KeyActionConfirm:
		filtered := m.filteredOptions()
		if len(filtered) > 0 {
			m.chosenValue = filtered[m.cursor].Value
		} else {
			m.chosenValue = strings.TrimSpace(m.query)
		}
		m.done = true
		return m, tea.Quit
	}

	return m, nil
}

func (m *directoryPromptModel) View() string {
	if m.done {
		value := strings.TrimSpace(m.result())
		if value == "" {
			value = m.defaultValue
		}
		return style.PromptCursor() + style.PromptActive(value)
	}

	var b strings.Builder

	b.WriteString(style.PromptCursor())
	query := strings.TrimSpace(m.query)
	if query != "" {
		b.WriteString(style.PromptActive(query))
	}
	if m.cursorBlink {
		b.WriteString(style.PromptHint("_"))
	} else {
		b.WriteString(" ")
	}
	b.WriteString("\n")
	b.WriteString(style.PromptHint("Type to filter/set value, tab to autocomplete directories, enter to confirm."))
	b.WriteString("\n\n")

	filtered := m.filteredOptions()
	if len(filtered) == 0 {
		b.WriteString(style.PromptHint("No matching suggestions. Press enter to use typed value."))
		return b.String()
	}

	maxWidth := 0
	for _, option := range filtered {
		if len(option.Value) > maxWidth {
			maxWidth = len(option.Value)
		}
	}
	for i, option := range filtered {
		prefix := "  "
		value := option.Value
		if i == m.cursor {
			prefix = style.PromptCursor()
			value = style.PromptActive(value)
		}
		padding := strings.Repeat(" ", tui.MaxInt(1, maxWidth-len(option.Value)+2))
		b.WriteString(prefix)
		b.WriteString(value)
		b.WriteString(padding)
		b.WriteString(style.PromptHint(option.Description))
		b.WriteString("\n")
	}

	return strings.TrimRight(b.String(), "\n")
}

func (m *directoryPromptModel) filteredOptions() []directoryPromptOption {
	query := strings.ToLower(strings.TrimSpace(m.query))
	if query == "" {
		return m.options
	}

	filtered := make([]directoryPromptOption, 0, len(m.options))
	for _, option := range m.options {
		if strings.Contains(strings.ToLower(option.Value), query) {
			filtered = append(filtered, option)
		}
	}
	return filtered
}

func (m *directoryPromptModel) clampCursor() {
	filtered := m.filteredOptions()
	if len(filtered) == 0 {
		m.cursor = 0
		return
	}
	if m.cursor < 0 {
		m.cursor = 0
		return
	}
	if m.cursor >= len(filtered) {
		m.cursor = len(filtered) - 1
	}
}

func (m *directoryPromptModel) autocomplete() {
	query := strings.TrimSpace(m.query)
	if query == "" {
		filtered := m.filteredOptions()
		if len(filtered) > 0 {
			m.chosenValue = filtered[m.cursor].Value
			m.query = filtered[m.cursor].Value
		}
		return
	}

	matches := make([]string, 0)
	for _, dir := range m.existingDirs {
		if strings.HasPrefix(dir, query) {
			matches = append(matches, dir)
		}
	}
	if len(matches) == 0 {
		return
	}
	sort.Strings(matches)
	m.query = tui.LongestCommonPrefix(matches)
}

func (m *directoryPromptModel) result() string {
	value := strings.TrimSpace(m.chosenValue)
	if value == "" {
		return m.defaultValue
	}
	return value
}
