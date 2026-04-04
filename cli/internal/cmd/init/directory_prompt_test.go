package initcmd

import (
	"strings"
	"testing"

	"maratus/cli/internal/tui"

	tea "github.com/charmbracelet/bubbletea"
)

func TestDirectoryPromptModelKeepsDefaultOptionVisibleWhenItMatchesFilter(t *testing.T) {
	model := newDirectoryPromptModel(
		"a-dir",
		[]directoryPromptOption{
			{Value: "a-dir", Description: "Use a-dir under source. (default)"},
			{Value: "b-dir", Description: "Existing directory."},
		},
		[]string{"a-dir", "b-dir"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'a'}})
	updated, ok := updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}

	filtered := updated.filteredOptions()
	if len(filtered) != 1 {
		t.Fatalf("expected 1 filtered option, got %d", len(filtered))
	}
	if filtered[0].Value != "a-dir" {
		t.Fatalf("expected filtered option to be a-dir, got %q", filtered[0].Value)
	}

	view := updated.View()
	if !strings.Contains(view, "a-dir") {
		t.Fatalf("expected rendered view to contain a-dir, got %q", view)
	}
	if strings.Contains(view, "No matching suggestions") {
		t.Fatalf("expected rendered view not to show empty-state message, got %q", view)
	}
}

func TestDirectoryPromptModelFiltersOnlyByValue(t *testing.T) {
	model := newDirectoryPromptModel(
		"components",
		[]directoryPromptOption{
			{Value: "components", Description: "Use components under source. (default)"},
			{Value: "styles", Description: "Existing directory."},
		},
		[]string{"components", "styles"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'c'}})
	updated, ok := updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}

	filtered := updated.filteredOptions()
	if len(filtered) != 1 {
		t.Fatalf("expected 1 filtered option, got %d", len(filtered))
	}
	if filtered[0].Value != "components" {
		t.Fatalf("expected filtered option to be components, got %q", filtered[0].Value)
	}
}

func TestDirectoryPromptModelRestoresOptionsWhenFilterCleared(t *testing.T) {
	model := newDirectoryPromptModel(
		"components",
		[]directoryPromptOption{
			{Value: "components", Description: "Use components under source. (default)"},
			{Value: "styles", Description: "Existing directory."},
		},
		[]string{"components", "styles"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'c'}})
	updated, ok := updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}

	updatedModel, _ = updated.Update(tea.KeyMsg{Type: tea.KeyBackspace})
	updated, ok = updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}

	filtered := updated.filteredOptions()
	if len(filtered) != 2 {
		t.Fatalf("expected 2 filtered options after clearing, got %d", len(filtered))
	}
	if filtered[0].Value != "components" || filtered[1].Value != "styles" {
		t.Fatalf("expected restored options to be components and styles, got %+v", filtered)
	}
}

func TestDirectoryPromptModelKeepsCursorStableWhenFilterChanges(t *testing.T) {
	model := newDirectoryPromptModel(
		"components",
		[]directoryPromptOption{
			{Value: "components", Description: "Use components under source. (default)"},
			{Value: "styles", Description: "Existing directory."},
		},
		[]string{"components", "styles"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyDown})
	updated, ok := updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}
	if updated.cursor != 1 {
		t.Fatalf("expected cursor at 1 after moving down, got %d", updated.cursor)
	}

	updatedModel, _ = updated.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'c'}})
	updated, ok = updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}
	if updated.cursor != 0 {
		t.Fatalf("expected cursor to clamp to 0 after filtering, got %d", updated.cursor)
	}

	updatedModel, _ = updated.Update(tea.KeyMsg{Type: tea.KeyBackspace})
	updated, ok = updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}
	if updated.cursor != 0 {
		t.Fatalf("expected cursor to stay at 0 after clearing filter, got %d", updated.cursor)
	}

	updatedModel, _ = updated.Update(tea.KeyMsg{Type: tea.KeyDown})
	updated, ok = updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}
	if updated.cursor != 1 {
		t.Fatalf("expected cursor to move to 1 after moving down again, got %d", updated.cursor)
	}
}

func TestDirectoryPromptModelAutocompleteUsesValueMatches(t *testing.T) {
	model := newDirectoryPromptModel(
		"components",
		[]directoryPromptOption{
			{Value: "components", Description: "Use components under source. (default)"},
			{Value: "styles", Description: "Existing directory."},
		},
		[]string{"components", "styles"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'c'}})
	updated, ok := updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}

	updatedModel, _ = updated.Update(tea.KeyMsg{Type: tea.KeyTab})
	updated, ok = updatedModel.(*directoryPromptModel)
	if !ok {
		t.Fatalf("expected directoryPromptModel, got %T", updatedModel)
	}
	if updated.query != "components" {
		t.Fatalf("expected autocomplete query to be components, got %q", updated.query)
	}
}

func TestDirectoryPromptModelDecodeBackspaceMatchesPromptBehavior(t *testing.T) {
	if got := tui.ApplyTextInput("c", tui.KeyActionBackspace, ""); got != "" {
		t.Fatalf("expected backspace to clear single-char query, got %q", got)
	}
}

func TestComponentsDirModelKeepsDefaultOptionVisibleWhenItMatchesFilter(t *testing.T) {
	model := newComponentsDirModel(
		"components",
		[]string{"components", "styles"},
		[]string{"components", "styles"},
	)

	updatedModel, _ := model.Update(tea.KeyMsg{Type: tea.KeyRunes, Runes: []rune{'c'}})
	updated, ok := updatedModel.(*componentsDirModel)
	if !ok {
		t.Fatalf("expected componentsDirModel, got %T", updatedModel)
	}

	view := updated.View()
	if !strings.Contains(view, "components") {
		t.Fatalf("expected rendered view to contain components, got %q", view)
	}
	if strings.Contains(view, "No matching suggestions") {
		t.Fatalf("expected rendered view not to show empty-state message, got %q", view)
	}
}
