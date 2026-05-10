# BooleanControl Requirements

## Normative Sources

- HTML Standard: [Checkbox state](<https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)>)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- WAI-ARIA 1.2: [`checkbox` role](https://www.w3.org/TR/wai-aria-1.2/#checkbox)
- WAI-ARIA 1.2: [`switch` role](https://www.w3.org/TR/wai-aria-1.2/#switch)
- WAI-ARIA 1.2: [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)
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

- Native boolean value controls rendered through `input[type="checkbox"]`
- Role-aware boolean controls for `checkbox` and `switch`
- Field relationship wiring through `FieldControl`
- Field-level required, readonly, and loading state translation
- Browser and custom validity event wiring

### Potential scope

- Checkbox and switch widget wrappers
- Tri-state checkbox support
- Checkbox group and choice-set controls

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                                                                                                         | Source                                                                                                                                         | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | `BooleanControl` must render inside a field context and use the field control id and relationship attributes provided by `FieldControl`.                                                                                                                            | WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                                                                                                           | Current       |
| REQ-002 | MUST   | Native boolean control render props must expose `type="checkbox"`.                                                                                                                                                                                                  | HTML Standard checkbox state                                                                                                                   | Current       |
| REQ-003 | MUST   | Native boolean control render props must expose the field `name`.                                                                                                                                                                                                   | HTML Standard form control infrastructure                                                                                                      | Current       |
| REQ-004 | MUST   | When the field is required, native boolean control render props must expose `required` and must not redundantly expose `aria-required`.                                                                                                                             | HTML Standard form control infrastructure; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2                                                     | Current       |
| REQ-005 | MUST   | When the field is loading, native boolean control render props must expose `disabled`, `aria-busy`, and `aria-disabled`.                                                                                                                                            | HTML Standard form control infrastructure; WAI-ARIA 1.2 `aria-busy`; WAI-ARIA 1.2 `aria-disabled`                                              | Current       |
| REQ-006 | MUST   | Native boolean control render props must allow consumers to preserve native checked state and browser constraint validation behaviour.                                                                                                                              | HTML Standard checkbox state; HTML Standard constraint validation                                                                              | Current       |
| REQ-007 | MUST   | `BooleanControl` role support must be limited to `checkbox` and `switch`.                                                                                                                                                                                           | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`; WCAG 2.2 SC 4.1.2                                                                              | Current       |
| REQ-008 | MUST   | Role-aware boolean control render props must expose the requested supported role, preserve consumer-provided `aria-checked`, and preserve field relationship attributes.                                                                                            | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`; WAI-ARIA 1.2 `aria-checked`; WAI-ARIA 1.2 `aria-describedby`; WAI-ARIA 1.2 `aria-errormessage` | Current       |
| REQ-009 | MUST   | When a role-aware boolean control is required, render props must expose `aria-required="true"` and must not expose native `required`.                                                                                                                               | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                                                                             | Current       |
| REQ-010 | SHOULD | When a role-aware boolean control is rendered with a custom element that does not expose `ValidityState`, render props should expose a validity event wrapper that lets consumers pass custom validity state through the same validity handlers as native controls. | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                                                                      | Current       |
| REQ-011 | MUST   | When a role-aware boolean control is readonly, render props must expose `aria-readonly="true"` and must not expose native `readOnly`.                                                                                                                               | WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                                                                                                | Current       |

## Product Requirements

| ID      | Requirement                                                                                                         | Applicability |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Export `BooleanControl`, `useBooleanControl`, and their public types from the boolean-control package entry point.  | Current       |
| PRD-002 | `BooleanControl` should support role-aware boolean widgets through an explicit supported role API.                  | Current       |
| PRD-003 | `BooleanControl` should depend on the field package instead of duplicating field relationship or validity plumbing. | Current       |
| PRD-004 | Native boolean control render props must be available during server rendering.                                      | Current       |
