package initcmd

import (
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskLibDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	return askDirectory(
		cmd,
		configRoot,
		srcDir,
		"lib",
		"Lib directory",
		"Directory under source for generated shared library files.",
		func(defaultValue string, suggestions []string, existingDirs []string) tea.Model {
			return newLibDirModel(defaultValue, suggestions, existingDirs)
		},
		"lib dir",
		"lib directory selection cancelled",
	)
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
func (m *libDirModel) isCancelled() bool { return m.cancelled }
