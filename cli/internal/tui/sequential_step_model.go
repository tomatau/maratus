package tui

import (
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
)

type SequentialStepModel struct {
	Spinner StepSpinner
}

func NewSequentialStepModel(initialText string, successText string, failureText string) SequentialStepModel {
	return SequentialStepModel{
		Spinner: NewStepSpinner(initialText, successText, failureText),
	}
}

func (m SequentialStepModel) Init(next tea.Cmd) tea.Cmd {
	return m.Spinner.Init(next)
}

func (m *SequentialStepModel) UpdateTick(msg spinner.TickMsg) tea.Cmd {
	return m.Spinner.UpdateTick(msg)
}

func (m *SequentialStepModel) SetProgress(text string) {
	m.Spinner.SetProgress(text)
}

func (m *SequentialStepModel) Finish(err error) tea.Cmd {
	return m.Spinner.Finish(err)
}

func (m SequentialStepModel) Err() error {
	return m.Spinner.Err()
}

func (m SequentialStepModel) View() string {
	return m.Spinner.View()
}
