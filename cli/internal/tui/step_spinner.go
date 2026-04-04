package tui

import (
	"fmt"
	"maratus/cli/internal/style"

	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
)

type StepSpinner struct {
	spinner     spinner.Model
	progress    string
	successText string
	failureText string
	done        bool
	err         error
}

func NewStepSpinner(initialText string, successText string, failureText string) StepSpinner {
	s := spinner.New()
	s.Spinner = spinner.Dot
	return StepSpinner{
		spinner:     s,
		progress:    initialText,
		successText: successText,
		failureText: failureText,
	}
}

func (s StepSpinner) Init(next tea.Cmd) tea.Cmd {
	return tea.Batch(s.spinner.Tick, next)
}

func (s *StepSpinner) UpdateTick(msg spinner.TickMsg) tea.Cmd {
	var tick tea.Cmd
	s.spinner, tick = s.spinner.Update(msg)
	return tick
}

func (s *StepSpinner) SetProgress(text string) {
	s.progress = text
}

func (s *StepSpinner) Finish(err error) tea.Cmd {
	s.done = true
	s.err = err
	return tea.Quit
}

func (s StepSpinner) Err() error {
	return s.err
}

func (s StepSpinner) View() string {
	if s.done {
		if s.err != nil {
			return style.PromptHint(s.failureText)
		}
		return style.PromptHint(s.successText)
	}
	return fmt.Sprintf("%s %s", s.spinner.View(), style.PromptHint(s.progress))
}
