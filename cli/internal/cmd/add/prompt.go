package addcmd

import (
	"fmt"
	"maratus/cli/internal/manifest"
	"maratus/cli/internal/project"
	"maratus/cli/internal/style"
	"maratus/cli/internal/tui"
	"slices"
	"strings"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func PromptComponents(cmd *cobra.Command, proj project.Project) ([]string, error) {
	available, err := manifest.AvailableComponents(proj.RegistryManifestPath)
	if err != nil {
		return nil, err
	}
	if len(available) == 0 {
		return nil, fmt.Errorf("no components available in registry")
	}

	if !tui.IsInteractiveSession(cmd) {
		return nil, fmt.Errorf("no components provided. available: %s", strings.Join(available, ", "))
	}

	model := newComponentPickerModel(available)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return nil, err
	}

	m, ok := finalModel.(*componentPickerModel)
	if !ok {
		return nil, fmt.Errorf("unexpected picker model type")
	}
	if m.cancelled {
		return nil, fmt.Errorf("component selection cancelled")
	}

	selected := m.selected()
	if len(selected) == 0 {
		return nil, fmt.Errorf("at least one component must be selected")
	}
	return selected, nil
}

type componentPickerModel struct {
	options   []string
	cursor    int
	selecteds map[int]struct{}
	done      bool
	cancelled bool
}

func newComponentPickerModel(options []string) *componentPickerModel {
	return &componentPickerModel{
		options:   options,
		cursor:    0,
		selecteds: map[int]struct{}{},
	}
}

func (m *componentPickerModel) Init() tea.Cmd {
	return nil
}

func (m *componentPickerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	keyMsg, ok := msg.(tea.KeyMsg)
	if !ok {
		return m, nil
	}
	action, _ := tui.DecodeKeyAction(keyMsg)

	switch action {
	case tui.KeyActionCancel:
		m.cancelled = true
		return m, tea.Quit
	case tui.KeyActionUp, tui.KeyActionDown:
		m.cursor = tui.MoveCursor(m.cursor, len(m.options), action)
	case tui.KeyActionToggle:
		if _, ok := m.selecteds[m.cursor]; ok {
			delete(m.selecteds, m.cursor)
		} else {
			m.selecteds[m.cursor] = struct{}{}
		}
	case tui.KeyActionConfirm:
		m.done = true
		return m, tea.Quit
	}

	return m, nil
}

func (m *componentPickerModel) View() string {
	if m.done {
		return style.PromptCursor() + style.PromptActive(strings.Join(m.selected(), ", "))
	}

	var b strings.Builder

	b.WriteString(style.PromptTitle("Select components to add"))
	b.WriteString(" ")
	b.WriteString(style.PromptHint("(space to toggle, enter to confirm)"))
	b.WriteString("\n\n")

	for i, option := range m.options {
		cursor := "  "
		if i == m.cursor {
			cursor = style.PromptCursor()
		}

		check := style.PromptUnchecked()
		if _, ok := m.selecteds[i]; ok {
			check = style.PromptChecked()
		}

		label := option
		if i == m.cursor {
			label = style.PromptActive(option)
		}
		b.WriteString(fmt.Sprintf("%s%s %s\n", cursor, check, label))
	}

	return strings.TrimRight(b.String(), "\n")
}

func (m *componentPickerModel) selected() []string {
	indexes := make([]int, 0, len(m.selecteds))
	for index := range m.selecteds {
		indexes = append(indexes, index)
	}
	slices.Sort(indexes)

	selected := make([]string, 0, len(indexes))
	for _, index := range indexes {
		selected = append(selected, m.options[index])
	}
	return selected
}
