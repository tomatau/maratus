package addcmd

import (
	"fmt"
	"maratus/cli/internal/codemods"
	"maratus/cli/internal/config"
	"maratus/cli/internal/manifest"
	"maratus/cli/internal/project"
	"maratus/cli/internal/registry"
	"maratus/cli/internal/tui"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func runFeedbackModel[T tea.Model](cmd *cobra.Command, model tea.Model) (T, error) {
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		var zero T
		return zero, err
	}

	resultModel, ok := finalModel.(T)
	if !ok {
		var zero T
		return zero, fmt.Errorf("unexpected feedback model type")
	}

	return resultModel, nil
}

func installWithFeedback(
	cmd *cobra.Command,
	proj project.Project,
	components []string,
	selectedStyle config.Style,
) ([]InstallResult, []DependencyInstallResult, error) {
	if err := installConsumerPackages(proj, components); err != nil {
		return nil, nil, err
	}

	if !tui.IsInteractiveSession(cmd) {
		results, err := installComponentGraph(proj, components, selectedStyle)
		if err != nil {
			return nil, nil, err
		}
		dependencyResults, err := InstallDependencies(proj, collectDependencies(results))
		if err != nil {
			return nil, nil, err
		}
		return results, dependencyResults, nil
	}

	model := newInstallSpinnerModel(proj, components, selectedStyle)
	resultModel, err := runFeedbackModel[*installSpinnerModel](cmd, model)
	if err != nil {
		return nil, nil, err
	}
	if resultModel.steps.Err() != nil {
		return nil, nil, resultModel.steps.Err()
	}
	return resultModel.results, resultModel.dependencyResults, nil
}

func installConsumerPackages(
	proj project.Project,
	components []string,
) error {
	if proj.IsMaratusRepo || len(components) == 0 {
		return nil
	}

	componentPackageSpecs, err := manifest.ResolveComponentPackageSpecs(
		proj.RegistryManifestPath,
		components,
	)
	if err != nil {
		return err
	}

	codemodPackageSpecs, err := manifest.ResolveCodemodPackageSpecs(
		proj.RegistryManifestPath,
		[]string{
			codemods.RewriteInternalImportsName,
			codemods.RewriteRelativeImportsName,
		},
	)
	if err != nil {
		return err
	}

	return project.InstallPackages(
		proj.RootDir,
		proj.PackageManager,
		append(componentPackageSpecs, codemodPackageSpecs...),
	)
}

type installDoneMsg struct {
	results           []InstallResult
	dependencyResults []DependencyInstallResult
	err               error
}

type installComponentDoneMsg struct {
	result InstallResult
	err    error
}

type installDependenciesDoneMsg struct {
	results []DependencyInstallResult
	err     error
}

type installSpinnerModel struct {
	proj              project.Project
	components        []string
	style             config.Style
	steps             tui.SequentialStepModel
	componentIndex    int
	results           []InstallResult
	dependencyResults []DependencyInstallResult
}

func newInstallSpinnerModel(
	proj project.Project,
	components []string,
	selectedStyle config.Style,
) *installSpinnerModel {
	return &installSpinnerModel{
		proj:       proj,
		components: components,
		style:      selectedStyle,
		steps: tui.NewSequentialStepModel(
			"Preparing install...",
			"Installed components",
			"Failed installing components",
		),
	}
}

func (m *installSpinnerModel) Init() tea.Cmd {
	return m.steps.Init(m.nextInstallCmd())
}

func (m *installSpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		return m, m.steps.UpdateTick(msg)
	case installComponentDoneMsg:
		if msg.err != nil {
			return m, m.steps.Finish(msg.err)
		}
		m.results = append(m.results, msg.result)
		m.components = queueComponentDependencies(
			m.components,
			msg.result.ComponentDependencies,
		)
		m.componentIndex += 1
		return m, m.nextInstallCmd()
	case installDependenciesDoneMsg:
		if msg.err != nil {
			return m, m.steps.Finish(msg.err)
		}
		m.dependencyResults = msg.results
		return m, m.steps.Finish(nil)
	case installDoneMsg:
		m.results = msg.results
		m.dependencyResults = msg.dependencyResults
		return m, m.steps.Finish(msg.err)
	default:
		return m, nil
	}
}

func (m *installSpinnerModel) View() string {
	return m.steps.View()
}

func (m *installSpinnerModel) nextInstallCmd() tea.Cmd {
	if m.componentIndex < len(m.components) {
		component := m.components[m.componentIndex]
		m.steps.SetProgress(fmt.Sprintf(
			"Installing component %d of %d: %s",
			m.componentIndex+1,
			len(m.components),
			component,
		))
		return func() tea.Msg {
			time.Sleep(150 * time.Millisecond)
			result, err := InstallComponent(m.proj, component, m.style)
			return installComponentDoneMsg{result: result, err: err}
		}
	}

	m.steps.SetProgress("Installing lib dependencies...")
	return func() tea.Msg {
		time.Sleep(150 * time.Millisecond)
		results, err := InstallDependencies(m.proj, collectDependencies(m.results))
		return installDependenciesDoneMsg{results: results, err: err}
	}
}

func installComponentGraph(
	proj project.Project,
	components []string,
	selectedStyle config.Style,
) ([]InstallResult, error) {
	pending := registry.DedupePackageNames(components)
	installed := map[string]struct{}{}
	results := make([]InstallResult, 0, len(pending))

	for len(pending) > 0 {
		component := pending[0]
		pending = pending[1:]
		if _, ok := installed[component]; ok {
			continue
		}

		result, err := InstallComponent(proj, component, selectedStyle)
		if err != nil {
			return nil, err
		}
		installed[component] = struct{}{}
		results = append(results, result)

		for _, dependency := range result.ComponentDependencies {
			if _, ok := installed[dependency]; ok {
				continue
			}
			pending = append(pending, dependency)
		}
		pending = registry.DedupePackageNames(pending)
	}

	return results, nil
}

func collectDependencies(results []InstallResult) []string {
	dependencies := make([]string, 0)
	for _, result := range results {
		dependencies = append(dependencies, result.LibDependencies...)
	}
	return dependencies
}

func queueComponentDependencies(components []string, dependencies []string) []string {
	seen := make(map[string]struct{}, len(components))
	for _, component := range components {
		seen[component] = struct{}{}
	}
	for _, dependency := range dependencies {
		if _, ok := seen[dependency]; ok {
			continue
		}
		seen[dependency] = struct{}{}
		components = append(components, dependency)
	}

	return components
}
