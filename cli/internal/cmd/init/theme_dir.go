package initcmd

import (
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func AskThemeDir(cmd *cobra.Command, configRoot string, srcDir string) (string, error) {
	return askDirectory(
		cmd,
		configRoot,
		srcDir,
		"styles",
		"Theme directory",
		"Directory under source for maratus-theme.css.",
		func(defaultValue string, suggestions []string, existingDirs []string) tea.Model {
			return newThemeDirModel(defaultValue, suggestions, existingDirs)
		},
		"theme dir",
		"theme directory selection cancelled",
	)
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
func (m *themeDirModel) isCancelled() bool { return m.cancelled }
