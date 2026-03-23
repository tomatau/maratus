package initcmd

import (
	"fmt"

	"arachne/cli/internal/style"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskLibDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	const defaultLibDir = "lib"

	srcRoot := sourceAbsPath(configRoot, srcDir)
	suggestions, err := childDirs(srcRoot)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultLibDir, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet("Lib directory"),
		style.Muted("Directory under source for generated shared library files."),
	)

	existingDirs := append([]string(nil), suggestions...)
	model := newLibDirModel(defaultLibDir, suggestions, existingDirs)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return "", err
	}

	resultModel, ok := finalModel.(*libDirModel)
	if !ok {
		return "", fmt.Errorf("unexpected lib dir model type")
	}
	if resultModel.cancelled {
		return "", fmt.Errorf("lib directory selection cancelled")
	}

	value := resultModel.result()
	printSelectedValue(cmd, value)
	return value, nil
}

type libDirModel struct {
	*directoryPromptModel
}

func newLibDirModel(defaultValue string, suggestions []string, existingDirs []string) *libDirModel {
	options := []directoryPromptOption{
		{Value: defaultValue, Description: "Use lib under source. (default)"},
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

	return &libDirModel{
		directoryPromptModel: newDirectoryPromptModel(defaultValue, options, existingDirs),
	}
}

func (m *libDirModel) Init() tea.Cmd { return m.directoryPromptModel.Init() }
func (m *libDirModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	_, cmd := m.directoryPromptModel.Update(msg)
	return m, cmd
}
func (m *libDirModel) View() string { return m.directoryPromptModel.View() }
