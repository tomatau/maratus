package tui

import tea "github.com/charmbracelet/bubbletea"

type KeyAction int

const (
	KeyActionNone KeyAction = iota
	KeyActionCancel
	KeyActionUp
	KeyActionDown
	KeyActionToggle
	KeyActionAutocomplete
	KeyActionBackspace
	KeyActionClear
	KeyActionConfirm
	KeyActionType
)

func DecodeKeyAction(msg tea.KeyMsg) (KeyAction, string) {
	switch msg.String() {
	case "ctrl+c", "esc", "q":
		return KeyActionCancel, ""
	case "up", "k":
		return KeyActionUp, ""
	case "down", "j":
		return KeyActionDown, ""
	case " ":
		return KeyActionToggle, ""
	case "tab":
		return KeyActionAutocomplete, ""
	case "backspace", "ctrl+h":
		return KeyActionBackspace, ""
	case "ctrl+u", "alt+backspace":
		return KeyActionClear, ""
	case "enter":
		return KeyActionConfirm, ""
	default:
		if len(msg.Runes) > 0 {
			return KeyActionType, string(msg.Runes)
		}
		return KeyActionNone, ""
	}
}

func MoveCursor(cursor int, count int, action KeyAction) int {
	if count <= 0 {
		return 0
	}
	switch action {
	case KeyActionUp:
		if cursor > 0 {
			return cursor - 1
		}
	case KeyActionDown:
		if cursor < count-1 {
			return cursor + 1
		}
	}
	if cursor < 0 {
		return 0
	}
	if cursor >= count {
		return count - 1
	}
	return cursor
}

func ApplyTextInput(query string, action KeyAction, typed string) string {
	switch action {
	case KeyActionBackspace:
		if len(query) == 0 {
			return query
		}
		return query[:len(query)-1]
	case KeyActionClear:
		return ""
	case KeyActionType:
		return query + typed
	default:
		return query
	}
}
