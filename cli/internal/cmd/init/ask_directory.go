package initcmd

import (
	"errors"
	"fmt"

	"maratus/cli/internal/style"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func askDirectory(
	cmd *cobra.Command,
	configRoot string,
	srcDir string,
	defaultValue string,
	title string,
	description string,
	newModel func(defaultValue string, suggestions []string, existingDirs []string) tea.Model,
	modelTypeName string,
	cancelMessage string,
) (string, error) {
	srcRoot := sourceAbsPath(configRoot, srcDir)
	suggestions, err := childDirs(srcRoot)
	if err != nil {
		return "", err
	}

	if !isInteractiveSession(cmd) {
		return defaultValue, nil
	}

	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"%s %s\n",
		style.Violet(title),
		style.Muted(description),
	)

	existingDirs := append([]string(nil), suggestions...)
	program := tea.NewProgram(
		newModel(defaultValue, suggestions, existingDirs),
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return "", err
	}

	resultModel, ok := finalModel.(interface {
		result() string
		isCancelled() bool
	})
	if !ok {
		return "", fmt.Errorf("unexpected %s model type", modelTypeName)
	}
	if resultModel.isCancelled() {
		return "", errors.New(cancelMessage)
	}

	value := resultModel.result()
	printSelectedValue(cmd, value)
	return value, nil
}
