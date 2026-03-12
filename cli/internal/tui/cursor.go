package tui

import (
	"time"

	tea "github.com/charmbracelet/bubbletea"
)

type CursorBlinkMsg struct{}

func CursorBlinkCmd() tea.Cmd {
	return tea.Tick(500*time.Millisecond, func(time.Time) tea.Msg {
		return CursorBlinkMsg{}
	})
}
