# BooleanControl Requirements

## Scope

### Surfaces

- `BooleanControl`
- `useBooleanControl`

### Current scope

- Native checkboxes, `input type="checkbox"`, with checkbox or switch semantics.
- Custom checkboxes and switches, `role="checkbox"` or `role="switch"`, with semantics, focus, and `Space` activation.
- Accessible field labels, descriptions, and error relationships.
- Field-level required, readonly, and loading state translation.
- Control-level disabled state.
- Reporting browser-detected and consumer-defined validation errors.
- Default styles, shared by both roots, with `--ara-boolean-control-*` tokens for the box and its hover, focus, checked, disabled, invalid, readonly, and loading states.

### Potential scope

- The HTML `switch` attribute on native checkboxes.
- Tri-state (`mixed`) checkboxes.
- Checkbox and switch widget wrappers.
- A `data-focus-visible` styling hook.

## Accessibility Requirements

### Given Any Root

| ID      | Level  | Requirement                                                                                                                     | Source                                                            | Surfaces       | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------- | ------------- |
| REQ-016 | MUST   | When the field has a description, the native checkbox's or custom root's `aria-describedby` must reference it.                  | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                | BooleanControl | Current       |
| REQ-017 | MUST   | When the field has visible errors, the native checkbox or custom root must have `aria-invalid="true"`.                          | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2 | BooleanControl | Current       |
| REQ-018 | MUST   | When the field has visible errors, the native checkbox's or custom root's `aria-errormessage` must reference the error message. | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1               | BooleanControl | Current       |
| REQ-019 | MUST   | When the field has no visible errors, the native checkbox or custom root must not have `aria-errormessage`.                     | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2               | BooleanControl | Current       |
| REQ-022 | MUST   | The native checkbox or custom root must not have the `readonly` attribute.                                                      | HTML Standard checkbox state; ARIA in HTML `readonly` attribute   | BooleanControl | Current       |
| REQ-023 | SHOULD | Readonly alone should not make the native checkbox or custom root disabled.                                                     | WAI-ARIA 1.2 `aria-readonly`                                      | BooleanControl | Current       |
| REQ-025 | MUST   | When the field is loading, the native checkbox or custom root must have `aria-busy="true"`.                                     | WAI-ARIA 1.2 `aria-busy`; GPRD-008                                | BooleanControl | Current       |
| REQ-048 | MUST   | When the native checkbox or custom root has keyboard focus, the default focus styles apply through `:focus-visible`.            | WCAG 2.2 SC 2.4.7; Selectors Level 4 `:focus-visible`             | BooleanControl | Current       |
| REQ-049 | SHOULD | Pointer focus alone does not apply the default focus styles to the native checkbox or custom root.                              | Selectors Level 4 `:focus-visible`                                | BooleanControl | Current       |

### Given Native Checkbox

| ID      | Level  | Requirement                                                                                                                                  | Source                                                                              | Surfaces       | Applicability |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------- | ------------- |
| REQ-001 | MUST   | The label's `for` must match the native checkbox's `id`.                                                                                     | HTML Standard `label`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                         | BooleanControl | Current       |
| REQ-002 | MUST   | The native checkbox must render as an `input` with `type="checkbox"`.                                                                        | HTML Standard checkbox state; WCAG 2.2 SC 4.1.2                                     | BooleanControl | Current       |
| REQ-004 | MUST   | When the field is required, the native checkbox must have the `required` attribute, unless PRD-024 applies.                                  | HTML Standard checkbox state; WCAG 2.2 SC 3.3.2                                     | BooleanControl | Current       |
| REQ-005 | MUST   | When the field is loading and `disabledBehavior` is `native`, the native checkbox must have `disabled`.                                      | HTML Standard disabled form controls; GPRD-008                                      | BooleanControl | Current       |
| REQ-034 | MUST   | When `disabled` is true and `disabledBehavior` is `native`, the native checkbox must have the `disabled` attribute.                          | HTML Standard disabled form controls; WCAG 2.2 SC 4.1.2                             | BooleanControl | Current       |
| REQ-046 | MUST   | When `disabled` is true or the field is loading and `disabledBehavior` is `focusable`, the native checkbox must have `aria-disabled="true"`. | WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2                                     | BooleanControl | Current       |
| REQ-006 | MUST   | When the `checked` option is set, the native checkbox's DOM `checked` state must match it.                                                   | HTML Standard checkbox state; WCAG 2.2 SC 4.1.2                                     | BooleanControl | Current       |
| REQ-012 | MUST   | When `role` is `switch`, the native checkbox must have `role="switch"`.                                                                      | ARIA in HTML `input type=checkbox`; WAI-ARIA 1.2 `switch`; WCAG 2.2 SC 4.1.2        | BooleanControl | Current       |
| REQ-013 | SHOULD | When `role` is `checkbox` or unset, the native checkbox should omit an explicit `role`.                                                      | ARIA in HTML `input type=checkbox`                                                  | BooleanControl | Current       |
| REQ-014 | MUST   | The native checkbox must not have `aria-checked`.                                                                                            | ARIA in HTML `input type=checkbox`                                                  | BooleanControl | Current       |
| REQ-020 | SHOULD | When the native checkbox has `required`, it should not have `aria-required`.                                                                 | ARIA in HTML `required` attribute                                                   | BooleanControl | Current       |
| REQ-024 | MUST   | When the field is readonly, the native checkbox must have `aria-readonly="true"`.                                                            | WAI-ARIA 1.2 `aria-readonly`; ARIA in HTML `input type=checkbox`; WCAG 2.2 SC 4.1.2 | BooleanControl | Current       |
| REQ-026 | SHOULD | When the native checkbox has `disabled`, it should not have `aria-disabled`.                                                                 | ARIA in HTML `disabled` attribute                                                   | BooleanControl | Current       |
| REQ-029 | MUST   | Pointer activation toggles an enabled native checkbox when the field is not readonly.                                                        | HTML Standard `input`; HTML Standard checkbox state                                 | BooleanControl | Current       |
| REQ-030 | MUST   | Keyboard users can toggle an enabled native checkbox when the field is not readonly, using the browser's native checkbox interaction.        | WCAG 2.2 SC 2.1.1                                                                   | BooleanControl | Current       |
| REQ-031 | MUST   | When `disabled` is true or the field is loading, pointer interaction cannot toggle the native checkbox, whatever its `disabledBehavior`.     | HTML Standard disabled form controls; WAI-ARIA 1.2 `aria-disabled`                  | BooleanControl | Current       |
| REQ-032 | MUST   | When `disabled` is true or the field is loading, keyboard interaction cannot toggle the native checkbox, whatever its `disabledBehavior`.    | HTML Standard disabled form controls; WAI-ARIA 1.2 `aria-disabled`                  | BooleanControl | Current       |
| REQ-047 | MUST   | When the native checkbox is disabled or loading and `disabledBehavior` is `focusable`, `Tab` still moves focus away from it.                 | WCAG 2.2 SC 2.1.2                                                                   | BooleanControl | Current       |
| REQ-044 | MUST   | When the field is readonly, pointer interaction leaves the native checkbox's `checked` state unchanged and fires no `change` event.          | WAI-ARIA 1.2 `aria-readonly`                                                        | BooleanControl | Current       |
| REQ-045 | MUST   | When the field is readonly, keyboard interaction leaves the native checkbox's `checked` state unchanged and fires no `change` event.         | WAI-ARIA 1.2 `aria-readonly`                                                        | BooleanControl | Current       |

### Given Custom Root

The hook supplies the role, states, focus, and activation; the consumer updates `checked` (PRD-005). The Given Any Root rows also apply.

| ID      | Level | Requirement                                                                                                                           | Source                                                                                         | Surfaces       | Applicability |
| ------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------- | ------------- |
| REQ-007 | MUST  | The custom root must have `role="checkbox"` or `role="switch"`, as its required `role` option requests.                               | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`; WCAG 2.2 SC 4.1.2                              | BooleanControl | Current       |
| REQ-008 | MUST  | The custom root must have `aria-checked="true"` when the `checked` option is true, and `aria-checked="false"` otherwise.              | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`; WAI-ARIA 1.2 `aria-checked`; WCAG 2.2 SC 4.1.2 | BooleanControl | Current       |
| REQ-009 | MUST  | When the field is required, the custom root must have `aria-required="true"`.                                                         | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                             | BooleanControl | Current       |
| REQ-011 | MUST  | When the field is readonly, the custom root must have `aria-readonly="true"`.                                                         | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                       | BooleanControl | Current       |
| REQ-015 | MUST  | The custom root's `aria-labelledby` must reference the field label's `id`.                                                            | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `aria-labelledby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2  | BooleanControl | Current       |
| REQ-021 | MUST  | The custom root must not have the `required` attribute.                                                                               | ARIA in HTML `required` attribute; HTML Standard form control infrastructure                   | BooleanControl | Current       |
| REQ-027 | MUST  | When the field is loading, the custom root must have `aria-disabled="true"`.                                                          | WAI-ARIA 1.2 `aria-disabled`; GPRD-008                                                         | BooleanControl | Current       |
| REQ-035 | MUST  | When `disabled` is true, the custom root must have `aria-disabled="true"`.                                                            | WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2                                                | BooleanControl | Current       |
| REQ-037 | MUST  | When the custom root is enabled and the field is not loading, it must be keyboard focusable.                                          | WAI-ARIA 1.2 `checkbox`; WCAG 2.2 SC 2.1.1                                                     | BooleanControl | Current       |
| REQ-028 | MUST  | The custom root must not have the `disabled` attribute.                                                                               | HTML Standard disabled form controls                                                           | BooleanControl | Current       |
| REQ-038 | MUST  | Pointer activation of an enabled custom root calls the consumer's `onClick` when the field is not readonly.                           | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`                                                 | BooleanControl | Current       |
| REQ-039 | MUST  | When an enabled custom root has keyboard focus and the field is not readonly, `Space` activates it, calling the consumer's `onClick`. | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `switch`; WCAG 2.2 SC 2.1.1                              | BooleanControl | Current       |
| REQ-040 | MUST  | Pointer interaction cannot activate the custom root when `disabled` is true or the field is loading.                                  | WAI-ARIA 1.2 `aria-disabled`; GPRD-008                                                         | BooleanControl | Current       |
| REQ-041 | MUST  | Keyboard interaction cannot activate the custom root when `disabled` is true or the field is loading.                                 | WAI-ARIA 1.2 `aria-disabled`; GPRD-008                                                         | BooleanControl | Current       |
| REQ-042 | MUST  | When the field is readonly, pointer interaction cannot activate the custom root.                                                      | WAI-ARIA 1.2 `aria-readonly`                                                                   | BooleanControl | Current       |
| REQ-043 | MUST  | When the field is readonly, keyboard interaction cannot activate the custom root.                                                     | WAI-ARIA 1.2 `aria-readonly`                                                                   | BooleanControl | Current       |

## Product Requirements

| ID      | Requirement                                                                                                                                                                                                                                                                                    | Surfaces          | Applicability |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- |
| PRD-001 | Export `BooleanControl`, `useBooleanControl`, and their public types from the boolean-control package entry point.                                                                                                                                                                             | BooleanControl    | Current       |
| PRD-002 | `useBooleanControl` takes `mode: 'native' \| 'custom'` for the root, defaulting to `native`, and `role` for the semantics: optional `'checkbox' \| 'switch'` on a native root, and required `'checkbox' \| 'switch'` on a custom root (GPRD-003).                                              | BooleanControl    | Current       |
| PRD-003 | When the native checkbox fires `change`, `blur`, or `invalid` and `FieldRoot` has no `activeErrors`, the field's active errors must follow the checkbox's `ValidityState`.                                                                                                                     | BooleanControl    | Current       |
| PRD-004 | Native boolean control render props must be available during server rendering.                                                                                                                                                                                                                 | BooleanControl    | Current       |
| PRD-005 | `useBooleanControl` takes a `checked` option, required on a custom root, and holds no value state: a custom root renders its checked state only from that option, and a native checkbox without it keeps the browser's own state.                                                              | BooleanControl    | Current       |
| PRD-006 | When a consumer passes `readOnly` to `BooleanControl`, `BooleanControl` strips it from the rendered props and, in development, warns that HTML `readonly` does not apply to checkboxes and points to `FieldRoot`'s `isReadOnly`.                                                               | BooleanControl    | Current       |
| PRD-007 | `useBooleanControl` takes a `disabled` option and writes it as the `disabled` attribute on a native root, or as `aria-disabled="true"` on a custom root or when `disabledBehavior` is `focusable`.                                                                                             | BooleanControl    | Current       |
| PRD-008 | `BooleanControl` passes `useBooleanControl`'s result to its children, so the hook meets every `BooleanControl` requirement.                                                                                                                                                                    | useBooleanControl | Current       |
| PRD-010 | The native checkbox's `name` must match the configured field name, unless PRD-023 applies.                                                                                                                                                                                                     | BooleanControl    | Current       |
| PRD-011 | When a consumer reports a validation error for the custom root through a validity handler's second argument and `FieldRoot` has no `activeErrors`, the field must treat it as an active error; once the field's `errorPolicy` makes it visible, the custom root must meet REQ-017 and REQ-018. | BooleanControl    | Current       |
| PRD-012 | When `disabled` is true or the field is loading and `disabledBehavior` is `native`, the custom root's default `tabIndex` is `-1`, as a disabled native checkbox leaves the tab order.                                                                                                          | BooleanControl    | Current       |
| PRD-013 | A consumer's `tabIndex` on the custom root wins over the hook's default.                                                                                                                                                                                                                       | BooleanControl    | Current       |
| PRD-014 | The custom root activates on `Space` only, as a native checkbox does; `Enter`, which the APG makes optional for a switch, does not activate it.                                                                                                                                                | BooleanControl    | Current       |
| PRD-015 | Keyboard activation of the custom root runs the consumer's key handler first, and does not activate when that handler prevents default (GPRD-009, GPRD-010).                                                                                                                                   | BooleanControl    | Current       |
| PRD-016 | When the field is loading, the root has an empty `data-loading` attribute as a styling hook.                                                                                                                                                                                                   | BooleanControl    | Current       |
| PRD-017 | The custom root has only global attributes: ARIA, `class`, `data-*`, `id`, `role`, and `tabindex`, so it stays valid on whichever element the consumer renders.                                                                                                                                | BooleanControl    | Current       |
| PRD-018 | When the custom root has keyboard focus, pressing `Space` does not scroll the page, whether or not it is disabled, loading, or readonly, as `Space` does not on a focused native checkbox.                                                                                                     | BooleanControl    | Current       |
| PRD-019 | `useBooleanControl` takes `disabledBehavior: 'native' \| 'focusable'`, defaulting to `native`; it applies whenever `disabled` is true or the field is loading (GPRD-008, GPRD-011).                                                                                                            | BooleanControl    | Current       |
| PRD-020 | When `disabledBehavior` is `focusable`, a disabled or loading native checkbox has no `disabled` attribute, so it stays in the tab order.                                                                                                                                                       | BooleanControl    | Current       |
| PRD-021 | When `disabledBehavior` is `focusable`, a disabled or loading custom root's default `tabIndex` is `0`.                                                                                                                                                                                         | BooleanControl    | Current       |
| PRD-022 | When `disabledBehavior` is `focusable`, a disabled or loading native checkbox does not call the consumer's `onClick` or `onChange`, as a disabled native checkbox receives no `click` (GPRD-008).                                                                                              | BooleanControl    | Current       |
| PRD-023 | When `disabledBehavior` is `focusable`, a disabled or loading native checkbox stays out of its form's submitted data, as a disabled checkbox does, by having no `name`.                                                                                                                        | BooleanControl    | Current       |
| PRD-024 | When `disabledBehavior` is `focusable`, a disabled or loading native checkbox stays out of constraint validation, as a disabled checkbox does, by having no `required` attribute.                                                                                                              | BooleanControl    | Current       |
| PRD-025 | Both roots take their CSS `appearance` from `--ara-boolean-control-appearance`, which defaults to `auto`, so the browser draws a native checkbox until a consumer sets `none`.                                                                                                                 | BooleanControl    | Current       |
| PRD-026 | The native checkbox's `accent-color` comes from `--ara-boolean-control-bg--checked`, so its checked fill follows the checked token while the browser draws it.                                                                                                                                 | BooleanControl    | Current       |
| PRD-027 | Each root has an empty `data-focus-visible` attribute while it has keyboard focus, as a styling hook paired with `:focus-visible`.                                                                                                                                                             | BooleanControl    | Potential     |

## Global Requirements

How the root [`requirements.md`](../../requirements.md) applies to this package.

| ID       | Surfaces            | Applicability |
| -------- | ------------------- | ------------- |
| GPRD-003 | `useBooleanControl` | Current       |
| GPRD-004 | `useBooleanControl` | Current       |
| GPRD-005 | `BooleanControl`    | Current       |
| GPRD-008 | `BooleanControl`    | Current       |
| GPRD-009 | `BooleanControl`    | Current       |
| GPRD-010 | `BooleanControl`    | Current       |
| GPRD-011 | `BooleanControl`    | Current       |

## Normative Sources

- HTML Standard: [Checkbox state](<https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)>)
- HTML Standard: [`input` element](https://html.spec.whatwg.org/#the-input-element)
- HTML Standard: [`label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- HTML Standard: [Disabled form controls](https://html.spec.whatwg.org/#enabling-and-disabling-form-controls:-the-disabled-attribute)
- WAI-ARIA 1.2: [`checkbox` role](https://www.w3.org/TR/wai-aria-1.2/#checkbox)
- WAI-ARIA 1.2: [`switch` role](https://www.w3.org/TR/wai-aria-1.2/#switch)
- WAI-ARIA 1.2: [`aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- WAI-ARIA 1.2: [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- ARIA in HTML: [`input type=checkbox`](https://www.w3.org/TR/html-aria/#el-input-checkbox)
- ARIA in HTML: [`required` attribute](https://www.w3.org/TR/html-aria/#att-required)
- ARIA in HTML: [`readonly` attribute](https://www.w3.org/TR/html-aria/#att-readonly)
- ARIA in HTML: [`disabled` attribute](https://www.w3.org/TR/html-aria/#att-disabled)
- WCAG 2.2 SC 1.3.1: [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- WCAG 2.2 SC 2.1.1: [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- WCAG 2.2 SC 2.1.2: [No Keyboard Trap](https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html)
- WCAG 2.2 SC 2.4.7: [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- WCAG 2.2 SC 3.3.1: [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- WCAG 2.2 SC 3.3.2: [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- Selectors Level 4: [`:focus-visible`](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)
