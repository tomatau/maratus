# TextControl Requirements

## Normative Sources

- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- WAI-ARIA 1.2: [`combobox` role](https://www.w3.org/TR/wai-aria-1.2/#combobox)
- WAI-ARIA 1.2: [`searchbox` role](https://www.w3.org/TR/wai-aria-1.2/#searchbox)
- WAI-ARIA 1.2: [`textbox` role](https://www.w3.org/TR/wai-aria-1.2/#textbox)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- WCAG 2.2 SC 1.3.1: [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- WCAG 2.2 SC 3.3.1: [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- WCAG 2.2 SC 3.3.2: [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)

## Scope

### Current scope

- Native text value controls rendered through text-like `input` elements and `textarea`
- Role-aware text controls for `textbox`, `searchbox`, and `combobox`
- Field relationship wiring through `FieldControl`
- Field-level required, readonly, and loading state translation
- Browser and custom validity event wiring

### Potential scope

- Textarea and text input widget wrappers
- Autocomplete and combobox widget wrappers
- Formatting and masking adapters

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                                                                                                      | Source                                                                                            | Applicability |
| ------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | `TextControl` must render inside a field context and use the field control id and relationship attributes provided by `FieldControl`.                                                                                                                            | WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                                                              | Current       |
| REQ-002 | MUST   | Native text control render props must expose the field `name`.                                                                                                                                                                                                   | HTML Standard form control infrastructure                                                         | Current       |
| REQ-003 | MUST   | When the field is required, native text control render props must expose `required` and must not redundantly expose `aria-required`.                                                                                                                             | HTML Standard form control infrastructure; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2        | Current       |
| REQ-004 | MUST   | When the field is readonly, native text control render props must expose `readOnly` and must not redundantly expose `aria-readonly`.                                                                                                                             | HTML Standard form control infrastructure; WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2        | Current       |
| REQ-005 | MUST   | When the field is loading, native text control render props must expose `disabled`, `aria-busy`, and `aria-disabled`.                                                                                                                                            | HTML Standard form control infrastructure; WAI-ARIA 1.2 `aria-busy`; WAI-ARIA 1.2 `aria-disabled` | Current       |
| REQ-006 | MUST   | Native text control render props must allow consumers to preserve native attributes and browser constraint validation behaviour.                                                                                                                                 | HTML Standard form control infrastructure; HTML Standard constraint validation                    | Current       |
| REQ-007 | MUST   | `TextControl` role support must be limited to `textbox`, `searchbox`, and `combobox`.                                                                                                                                                                            | WAI-ARIA 1.2 widget roles; WCAG 2.2 SC 4.1.2                                                      | Current       |
| REQ-008 | MUST   | Role-aware text control render props must expose the requested supported role, preserve field relationship attributes, and preserve consumer-provided role-specific widget attributes.                                                                           | WAI-ARIA 1.2 widget roles; WAI-ARIA 1.2 `aria-describedby`; WAI-ARIA 1.2 `aria-errormessage`      | Current       |
| REQ-009 | MUST   | When a role-aware text control is required, render props must expose `aria-required="true"` and must not expose native `required`.                                                                                                                               | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                                | Current       |
| REQ-010 | MUST   | When a role-aware text control is readonly, render props must expose `aria-readonly="true"` and must not expose native `readOnly`.                                                                                                                               | WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                                                   | Current       |
| REQ-011 | SHOULD | When a role-aware text control is rendered with a native element that exposes `ValidityState`, render props should keep native validity handlers available.                                                                                                      | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1                                            | Current       |
| REQ-012 | SHOULD | When a role-aware text control is rendered with a custom element that does not expose `ValidityState`, render props should expose a validity event wrapper that lets consumers pass custom validity state through the same validity handlers as native controls. | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                         | Current       |

## Product Requirements

| ID      | Requirement                                                                                                      | Applicability |
| ------- | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Export `TextControl`, `useTextControl`, and their public types from the text-control package entry point.        | Current       |
| PRD-002 | `TextControl` should support role-aware text widgets through an explicit supported role API.                     | Current       |
| PRD-003 | `TextControl` should depend on the field package instead of duplicating field relationship or validity plumbing. | Current       |
| PRD-004 | Native text control render props must be available during server rendering.                                      | Current       |
