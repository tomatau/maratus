package initcmd

import (
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskComponentsDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	return askDirectory(
		cmd,
		configRoot,
		srcDir,
		"components",
		"Components directory",
		"Directory under source for generated component files.",
		func(defaultValue string, suggestions []string, existingDirs []string) tea.Model {
			return newComponentsDirModel(defaultValue, suggestions, existingDirs)
		},
		"components dir",
		"components directory selection cancelled",
	)
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
func (m *componentsDirModel) isCancelled() bool { return m.cancelled }
