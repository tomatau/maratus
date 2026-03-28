package addcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/project"
	"arachne/cli/internal/style"
	"arachne/cli/internal/tui"
	"fmt"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func installWithFeedback(cmd *cobra.Command, proj project.Project, components []string, selectedStyle config.Style) ([]InstallResult, []DependencyInstallResult, error) {
	if !tui.IsInteractiveSession(cmd) {
		results := make([]InstallResult, 0, len(components))
		for _, component := range components {
			result, err := InstallComponent(proj, component, selectedStyle)
			if err != nil {
				return nil, nil, err
			}
			results = append(results, result)
		}
		dependencyResults, err := InstallDependencies(proj, collectDependencies(results))
		if err != nil {
			return nil, nil, err
		}
		return results, dependencyResults, nil
	}

	model := newInstallSpinnerModel(proj, components, selectedStyle)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return nil, nil, err
	}

	resultModel, ok := finalModel.(*installSpinnerModel)
	if !ok {
		return nil, nil, fmt.Errorf("unexpected install spinner model type")
	}
	if resultModel.err != nil {
		return nil, nil, resultModel.err
	}
	return resultModel.results, resultModel.dependencyResults, nil
}

func printInstallSummary(cmd *cobra.Command, results []InstallResult, dependencyResults []DependencyInstallResult, themeFilePath string, themeFileStatus string) {
	if len(results) == 0 && len(dependencyResults) == 0 {
		return
	}
	if len(results) > 0 {
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle("Installed components"))
		for _, result := range results {
			label := result.Component
			if result.InstalledAs != "" {
				label = result.InstalledAs
			}
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"%s%s\n",
				style.PromptCursor(),
				style.PromptActive(label),
			)
			for _, file := range result.Files {
				_, _ = fmt.Fprintf(
					cmd.OutOrStdout(),
					"  %s%s\n",
					style.PromptHint("• "),
					style.PromptHint(file),
				)
			}
		}
	}

	if len(dependencyResults) > 0 {
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle("Installed lib dependencies"))
		for _, result := range dependencyResults {
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"%s%s\n",
				style.PromptCursor(),
				style.PromptActive(result.Package),
			)
			for _, file := range result.Files {
				_, _ = fmt.Fprintf(
					cmd.OutOrStdout(),
					"  %s%s\n",
					style.PromptHint("• "),
					style.PromptHint(file),
				)
			}
		}
	}

	if themeFilePath != "" {
		title := "Theme file updated"
		if themeFileStatus == "created" {
			title = "Theme file created"
		}
		_, _ = fmt.Fprintf(cmd.OutOrStdout(), "\n%s\n", style.PromptTitle(title))
		_, _ = fmt.Fprintf(
			cmd.OutOrStdout(),
			"%s%s\n",
			style.PromptCursor(),
			style.PromptHint(themeFilePath),
		)
		if themeFileStatus == "created" {
			_, _ = fmt.Fprintf(
				cmd.OutOrStdout(),
				"\nAdd an @import for the `arachne-theme.css` file in your stylesheet entrypoint.\n",
			)
		}
	}
}

type installDoneMsg struct {
	results           []InstallResult
	dependencyResults []DependencyInstallResult
	err               error
}

type installSpinnerModel struct {
	proj              project.Project
	components        []string
	style             config.Style
	spinner           spinner.Model
	results           []InstallResult
	dependencyResults []DependencyInstallResult
	done              bool
	err               error
}

func newInstallSpinnerModel(proj project.Project, components []string, selectedStyle config.Style) *installSpinnerModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	return &installSpinnerModel{
		proj:       proj,
		components: components,
		style:      selectedStyle,
		spinner:    s,
	}
}

func (m *installSpinnerModel) Init() tea.Cmd {
	return tea.Batch(m.spinner.Tick, m.installCmd())
}

func (m *installSpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		var tick tea.Cmd
		m.spinner, tick = m.spinner.Update(msg)
		return m, tick
	case installDoneMsg:
		m.done = true
		m.results = msg.results
		m.dependencyResults = msg.dependencyResults
		m.err = msg.err
		return m, tea.Quit
	default:
		return m, nil
	}
}

func (m *installSpinnerModel) View() string {
	if m.done {
		if m.err != nil {
			return style.PromptHint("Failed installing components")
		}
		return style.PromptHint("Installed components")
	}
	return fmt.Sprintf("%s %s", m.spinner.View(), style.PromptHint("Installing components..."))
}

func (m *installSpinnerModel) installCmd() tea.Cmd {
	return func() tea.Msg {
		time.Sleep(150 * time.Millisecond)

		results := make([]InstallResult, 0, len(m.components))
		for _, component := range m.components {
			result, err := InstallComponent(m.proj, component, m.style)
			if err != nil {
				return installDoneMsg{err: err}
			}
			results = append(results, result)
		}
		dependencyResults, err := InstallDependencies(m.proj, collectDependencies(results))
		if err != nil {
			return installDoneMsg{err: err}
		}
		return installDoneMsg{results: results, dependencyResults: dependencyResults}
	}
}

func collectDependencies(results []InstallResult) []string {
	dependencies := make([]string, 0)
	for _, result := range results {
		dependencies = append(dependencies, result.Dependencies...)
	}
	return dependencies
}
