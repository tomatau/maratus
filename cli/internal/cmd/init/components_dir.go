package initcmd

import (
	"fmt"

	"arachne/cli/internal/style"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskComponentsDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	const defaultComponentsDir = "components"

	srcRoot := sourceAbsPath(configRoot, srcDir)
	suggestions, err := childDirs(srcRoot)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultComponentsDir, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet("Components directory"),
		style.Muted("Directory under source for generated component files."),
	)

	existingDirs := append([]string(nil), suggestions...)
	model := newComponentsDirModel(defaultComponentsDir, suggestions, existingDirs)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return "", err
	}

	resultModel, ok := finalModel.(*componentsDirModel)
	if !ok {
		return "", fmt.Errorf("unexpected components dir model type")
	}
	if resultModel.cancelled {
		return "", fmt.Errorf("components directory selection cancelled")
	}

	value := resultModel.result()
	printSelectedValue(cmd, value)
	return value, nil
}

type componentsDirModel struct {
	*directoryPromptModel
}

func newComponentsDirModel(defaultValue string, suggestions []string, existingDirs []string) *componentsDirModel {
	options := []directoryPromptOption{
		{Value: defaultValue, Description: "Use components under source. (default)"},
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

	return &componentsDirModel{
		directoryPromptModel: newDirectoryPromptModel(defaultValue, options, existingDirs),
	}
}

func (m *componentsDirModel) Init() tea.Cmd { return m.directoryPromptModel.Init() }
func (m *componentsDirModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	_, cmd := m.directoryPromptModel.Update(msg)
	return m, cmd
}
func (m *componentsDirModel) View() string { return m.directoryPromptModel.View() }
