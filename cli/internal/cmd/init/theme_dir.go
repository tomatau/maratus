package initcmd

import (
	"fmt"
	"sort"
	"strings"

	"arachne/cli/internal/style"
	"arachne/cli/internal/tui"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskThemeDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	const defaultThemeDir = "styles"

	srcRoot := sourceAbsPath(configRoot, srcDir)
	suggestions, err := childDirs(srcRoot)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultThemeDir, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet("Theme directory"),
		style.Muted("Directory under source for arachne-theme.css."),
	)

	existingDirs := make([]string, 0, len(suggestions))
	existingDirs = append(existingDirs, suggestions...)
	model := newThemeDirModel(defaultThemeDir, suggestions, existingDirs)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return "", err
	}

	resultModel, ok := finalModel.(*themeDirModel)
	if !ok {
		return "", fmt.Errorf("unexpected theme dir model type")
	}
	if resultModel.cancelled {
		return "", fmt.Errorf("theme directory selection cancelled")
	}

	value := resultModel.result()
	printSelectedValue(cmd, value)
	return value, nil
}

type themeOption struct {
	Value       string
	Description string
}

type themeDirModel struct {
	defaultValue string
	options      []themeOption
	existingDirs []string
	query        string
	cursor       int
	cursorBlink  bool
	done         bool
	cancelled    bool
	chosenValue  string
}

func newThemeDirModel(defaultValue string, suggestions []string, existingDirs []string) *themeDirModel {
	options := []themeOption{
		{Value: defaultValue, Description: "Use styles under source. (default)"},
	}

	for _, suggestion := range suggestions {
		if suggestion == defaultValue {
			continue
		}
		options = append(options, themeOption{
			Value:       suggestion,
			Description: "Existing directory.",
		})
	}

	return &themeDirModel{
		defaultValue: defaultValue,
		options:      options,
		existingDirs: existingDirs,
	}
}

func (m *themeDirModel) Init() tea.Cmd {
	m.cursorBlink = true
	return tui.CursorBlinkCmd()
}

func (m *themeDirModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
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

func (m *themeDirModel) View() string {
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

func (m *themeDirModel) filteredOptions() []themeOption {
	query := strings.ToLower(strings.TrimSpace(m.query))
	if query == "" {
		return m.options
	}

	filtered := make([]themeOption, 0, len(m.options))
	for _, option := range m.options {
		if strings.Contains(strings.ToLower(option.Value), query) ||
			strings.Contains(strings.ToLower(option.Description), query) {
			filtered = append(filtered, option)
		}
	}
	return filtered
}

func (m *themeDirModel) clampCursor() {
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

func (m *themeDirModel) autocomplete() {
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

func (m *themeDirModel) result() string {
	value := strings.TrimSpace(m.chosenValue)
	if value == "" {
		return m.defaultValue
	}
	return value
}
