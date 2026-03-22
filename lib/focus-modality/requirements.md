# Focus Modality Requirements

## Normative Sources

- WCAG 2.2 SC 2.4.7: [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- WCAG 2.2 SC 2.4.11: [Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- WCAG 2.2 SC 2.4.13: [Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)
- Selectors Level 4: `[:focus-visible](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)`

## Scope

### Current scope

- Global focus modality state
- Global derived focus-visible state
- Hook access for focus modality and focus-visible state

### Potential scope

- Element-local focus-visible helpers
- Provider override for runtime scoping
- Virtual cursor or assistive technology modality distinctions

## Normative Matrix

| ID      | Level  | Requirement                                                                                                                                                               | Source                                                | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------- |
| REQ-001 | MUST   | Expose a mode of operation in which components that receive keyboard focus can render a visible focus indicator.                                                          | WCAG 2.2 SC 2.4.7                                     | Current       |
| REQ-002 | MUST   | Update the global focus modality when keyboard or pointer interaction occurs so focus-visible state can distinguish keyboard interaction from pointer interaction.        | Selectors Level 4 `:focus-visible`; WCAG 2.2 SC 2.4.7 | Current       |
| REQ-003 | MUST   | Expose focus-visible state separately from raw focus state so authors can style the visible focus indicator without changing when the indicator should appear.            | Selectors Level 4 `:focus-visible`                    | Current       |
| REQ-004 | MUST   | When focus-visible state is exposed, keep it compatible with author-provided focus indicators that satisfy the visibility and appearance requirements for keyboard focus. | WCAG 2.2 SC 2.4.7; WCAG 2.2 SC 2.4.13                 | Current       |
| REQ-005 | SHOULD | When focus-visible state is exposed, allow authors to keep the focused component at least partially visible while the indicator is shown.                                 | WCAG 2.2 SC 2.4.11                                    | Current       |

## Product Requirements

| ID      | Requirement                                                                                                      | Applicability |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Expose `useFocusModality()` as the low-level shared hook for reading the current global modality.                | Current       |
| PRD-002 | Expose `useIsFocusVisible()` as the shared derived hook for reading the current global focus-visible state.      | Current       |
| PRD-003 | Treat keyboard interaction as focus-visible by default.                                                          | Current       |
| PRD-005 | Start from a global singleton runtime and allow provider-based override later without changing the hook surface. | Potential     |
