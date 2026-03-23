package initcmd

import (
	"fmt"

	"arachne/cli/internal/style"

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

	existingDirs := append([]string(nil), suggestions...)
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

type themeDirModel struct {
	*directoryPromptModel
}

func newThemeDirModel(defaultValue string, suggestions []string, existingDirs []string) *themeDirModel {
	options := []directoryPromptOption{
		{Value: defaultValue, Description: "Use styles under source. (default)"},
	}

	for _, suggestion := range suggestions {
		if suggestion == defaultValue {
			continue
		}
		options = append(options, directoryPromptOption{
			Value:       suggestion,
			Description: "Existing directory.",
		})
	}

	return &themeDirModel{
		directoryPromptModel: newDirectoryPromptModel(defaultValue, options, existingDirs),
	}
}

func (m *themeDirModel) Init() tea.Cmd { return m.directoryPromptModel.Init() }
func (m *themeDirModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	_, cmd := m.directoryPromptModel.Update(msg)
	return m, cmd
}
func (m *themeDirModel) View() string { return m.directoryPromptModel.View() }
