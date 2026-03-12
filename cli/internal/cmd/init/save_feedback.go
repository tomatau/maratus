package initcmd

import (
	"arachne/cli/internal/config"
	"arachne/cli/internal/style"
	"arachne/cli/internal/tui"
	"encoding/json"
	"fmt"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/spf13/cobra"
)

func SaveConfigWithFeedback(cmd *cobra.Command, path string, cfg config.Config) error {
	if !tui.IsInteractiveSession(cmd) {
		return config.Save(path, cfg)
	}

	model := newSaveSpinnerModel(path, cfg)
	program := tea.NewProgram(
		model,
		tea.WithInput(cmd.InOrStdin()),
		tea.WithOutput(cmd.OutOrStdout()),
	)
	finalModel, err := program.Run()
	if err != nil {
		return err
	}

	resultModel, ok := finalModel.(*saveSpinnerModel)
	if !ok {
		return fmt.Errorf("unexpected save spinner model type")
	}
	if resultModel.err != nil {
		return resultModel.err
	}

	preview, err := json.MarshalIndent(cfg, "", "  ")
	if err != nil {
		return err
	}
	_, _ = fmt.Fprintf(
		cmd.OutOrStdout(),
		"\n%s %s\n%s\n",
		style.PromptTitle("Your config"),
		style.PromptHint("["+path+"]"),
		string(preview),
	)
	return nil
}

type saveDoneMsg struct {
	err error
}

type saveSpinnerModel struct {
	path    string
	cfg     config.Config
	spinner spinner.Model
	done    bool
	err     error
}

func newSaveSpinnerModel(path string, cfg config.Config) *saveSpinnerModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	return &saveSpinnerModel{
		path:    path,
		cfg:     cfg,
		spinner: s,
	}
}

func (m *saveSpinnerModel) Init() tea.Cmd {
	return tea.Batch(m.spinner.Tick, m.saveConfigCmd())
}

func (m *saveSpinnerModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case spinner.TickMsg:
		var tick tea.Cmd
		m.spinner, tick = m.spinner.Update(msg)
		return m, tick
	case saveDoneMsg:
		m.done = true
		m.err = msg.err
		return m, tea.Quit
	default:
		return m, nil
	}
}

func (m *saveSpinnerModel) View() string {
	if m.done {
		if m.err != nil {
			return style.PromptHint("Failed writing arachne.json")
		}
		return style.PromptHint("Saved arachne.json")
	}
	return fmt.Sprintf("%s %s", m.spinner.View(), style.PromptHint("Writing arachne.json..."))
}

func (m *saveSpinnerModel) saveConfigCmd() tea.Cmd {
	return func() tea.Msg {
		time.Sleep(250 * time.Millisecond)
		return saveDoneMsg{err: config.Save(m.path, m.cfg)}
	}
}
