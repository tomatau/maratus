package addcmd

import (
	"maratus/cli/internal/config"
	"maratus/cli/internal/project"
	"maratus/cli/internal/tui"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

type updateThemeDoneMsg struct {
	themeFilePath   string
	themeFileStatus string
	err             error
}

type formatDoneMsg struct {
	err error
}

type postInstallSpinnerModel struct {
	proj              project.Project
	selectedStyle     config.Style
	results           []InstallResult
	dependencyResults []DependencyInstallResult
	steps             tui.SequentialStepModel
	themePending      bool
	formatPending     bool
	themeFilePath     string
	themeFileStatus   string
}

func runPostInstallWithFeedback(
	cmd *cobra.Command,
	proj project.Project,
	selectedStyle config.Style,
	results []InstallResult,
	dependencyResults []DependencyInstallResult,
) (string, string, error) {
	if !tui.IsInteractiveSession(cmd) {
		themeFilePath, themeFileStatus, err := runThemeUpdate(proj, selectedStyle)
		if err != nil {
			return "", "", err
		}
		runFormatCommand(proj, results, dependencyResults, themeFilePath)
		return themeFilePath, themeFileStatus, nil
	}

	model := newPostInstallSpinnerModel(proj, selectedStyle, results, dependencyResults)
	resultModel, err := runFeedbackModel[*postInstallSpinnerModel](cmd, model)
	if err != nil {
		return "", "", err
	}
	if resultModel.steps.Err() != nil {
		return "", "", resultModel.steps.Err()
	}

	return resultModel.themeFilePath, resultModel.themeFileStatus, nil
}

func newPostInstallSpinnerModel(
	proj project.Project,
	selectedStyle config.Style,
	results []InstallResult,
	dependencyResults []DependencyInstallResult,
) *postInstallSpinnerModel {
	return &postInstallSpinnerModel{
		proj:              proj,
		selectedStyle:     selectedStyle,
		results:           results,
		dependencyResults: dependencyResults,
		steps: tui.NewSequentialStepModel(
			"Finalising install...",
			"Finalised install",
			"Failed finalising install",
		),
		themePending:  selectedStyle == config.StyleTailwindCSS || selectedStyle == config.StyleCSSFiles || selectedStyle == config.StyleCSSModules,
		formatPending: shouldRunFormatCommand(proj),
	}
}

func (m *postInstallSpinnerModel) Init() tea.Cmd {
	return m.steps.Init(m.nextCmd())
}

func (m *postInstallSpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		return m, m.steps.UpdateTick(msg)
	case updateThemeDoneMsg:
		if msg.err != nil {
			return m, m.steps.Finish(msg.err)
		}
		m.themeFilePath = msg.themeFilePath
		m.themeFileStatus = msg.themeFileStatus
		m.themePending = false
		return m, m.nextCmd()
	case formatDoneMsg:
		m.formatPending = false
		return m, m.steps.Finish(msg.err)
	default:
		return m, nil
	}
}

func (m *postInstallSpinnerModel) View() string {
	return m.steps.View()
}

func (m *postInstallSpinnerModel) nextCmd() tea.Cmd {
	if m.themePending {
		m.steps.SetProgress("Updating theme file...")
		return func() tea.Msg {
			time.Sleep(150 * time.Millisecond)
			path, status, err := runThemeUpdate(m.proj, m.selectedStyle)
			return updateThemeDoneMsg{
				themeFilePath:   path,
				themeFileStatus: status,
				err:             err,
			}
		}
	}

	if m.formatPending {
		m.steps.SetProgress("Formatting files...")
		return func() tea.Msg {
			time.Sleep(150 * time.Millisecond)
			runFormatCommand(m.proj, m.results, m.dependencyResults, m.themeFilePath)
			return formatDoneMsg{}
		}
	}

	return func() tea.Msg {
		return formatDoneMsg{}
	}
}

func runThemeUpdate(
	proj project.Project,
	selectedStyle config.Style,
) (string, string, error) {
	themeFilePath := ""
	themeFileStatus := ""
	if selectedStyle == config.StyleTailwindCSS || selectedStyle == config.StyleCSSFiles || selectedStyle == config.StyleCSSModules {
		path, created, err := updateThemeFile(proj)
		if err != nil {
			return "", "", err
		}
		themeFilePath = path
		if created {
			themeFileStatus = "created"
		} else {
			themeFileStatus = "updated"
		}
	}
	return themeFilePath, themeFileStatus, nil
}
