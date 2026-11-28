# ChoicesControl Requirements

## Scope

### Surfaces

- `ChoicesControl`
- `useChoicesControl`

### Current scope

- Native checkbox inputs in an explicitly labelled `role="group"` container.
- Custom checkbox items in an explicitly labelled `role="group"` container.
- Custom multi-select `listbox` option props.
- Accessible field labels, descriptions, and error relationships.
- Field-level required, readonly, and loading state translation.
- Reporting browser-detected and consumer-defined validation errors.

### Potential scope

- Keyboard interaction and active descendant management.
- Controlled or uncontrolled values state.
- Native multi-select wrappers.
- Native checkbox grouping with a `<fieldset>` and its first child `<legend>` as the group caption.
- Minimum and maximum selection validation helpers.

## Accessibility Requirements

### Given Any Root

| ID      | Level  | Requirement                                                                                                                                         | Source                                             | Surfaces       | Applicability |
| ------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | -------------- | ------------- |
| REQ-015 | MUST   | When the field has a description, the group or listbox root's `aria-describedby` must reference it.                                                 | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1 | ChoicesControl | Current       |
| REQ-026 | MUST   | When the field is loading, the `role="group"` or `role="listbox"` container must have `aria-busy="true"`.                                           | WAI-ARIA 1.2 `aria-busy`; GPRD-008                 | ChoicesControl | Current       |
| REQ-027 | MUST   | When the field is loading, the `role="group"` or `role="listbox"` container must have `aria-disabled="true"`.                                       | WAI-ARIA 1.2 `aria-disabled`; GPRD-008             | ChoicesControl | Current       |
| REQ-029 | MUST   | When the field is loading, each custom checkbox item and listbox option must have `aria-disabled="true"`.                                           | WAI-ARIA 1.2 `aria-disabled`; GPRD-008             | ChoicesControl | Current       |
| REQ-040 | SHOULD | When the field is readonly, native checkboxes, custom checkbox items, and listbox options should not be disabled, so users can still navigate them. | WAI-ARIA 1.2 `aria-readonly`                       | ChoicesControl | Current       |

### Given Native Checkbox Group

| ID      | Level  | Requirement                                                                                                                                                                                                        | Source                                                                                                   | Surfaces       | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| REQ-001 | MUST   | The `role="group"` container must contain its checkbox inputs.                                                                                                                                                     | WAI-ARIA 1.2 `group`; WCAG 2.2 SC 1.3.1                                                                  | ChoicesControl | Current       |
| REQ-002 | MUST   | Each native checkbox option must render as an `input` with `type="checkbox"`.                                                                                                                                      | HTML Standard checkbox state; WCAG 2.2 SC 4.1.2                                                          | ChoicesControl | Current       |
| REQ-003 | MUST   | The group must have an accessible name from its label.                                                                                                                                                             | WAI-ARIA 1.2 `group`; WAI-ARIA 1.2 `aria-labelledby`; WCAG 2.2 SC 1.3.1                                  | ChoicesControl | Current       |
| REQ-004 | MUST   | The group must omit `aria-required`.                                                                                                                                                                               | WAI-ARIA 1.2 `aria-required`; axe-core `aria-allowed-attr`[^unsupported-attribute]                       | ChoicesControl | Current       |
| REQ-007 | MUST   | Each native checkbox must have an accessible name that identifies its option.                                                                                                                                      | WCAG 2.2 SC 4.1.2                                                                                        | ChoicesControl | Current       |
| REQ-008 | MUST   | A native checkbox's DOM `checked` state must be true for a selected option and false for an unselected option.                                                                                                     | HTML Standard checkbox state; WCAG 2.2 SC 4.1.2                                                          | ChoicesControl | Current       |
| REQ-009 | MUST   | Pointer activation toggles an enabled checkbox in an editable group (the field is not readonly).                                                                                                                   | HTML Standard `input`; HTML Standard checkbox state                                                      | ChoicesControl | Current       |
| REQ-014 | MUST   | Pointer activation of one checkbox leaves the other checkboxes' `checked` state unchanged.                                                                                                                         | HTML Standard `input`; HTML Standard checkbox state                                                      | ChoicesControl | Current       |
| REQ-010 | MUST   | Keyboard users can toggle any enabled checkbox in an editable group (the field is not readonly) using the browser's native checkbox interaction.                                                                   | WCAG 2.2 SC 2.1.1                                                                                        | ChoicesControl | Current       |
| REQ-011 | MUST   | Pointer interaction cannot toggle a disabled checkbox.                                                                                                                                                             | HTML Standard disabled form controls                                                                     | ChoicesControl | Current       |
| REQ-012 | MUST   | Keyboard interaction cannot toggle a disabled checkbox.                                                                                                                                                            | HTML Standard disabled form controls                                                                     | ChoicesControl | Current       |
| REQ-016 | MUST   | A group-level selection rule must not make individual checkboxes required.                                                                                                                                         | HTML Standard checkbox state; HTML Standard constraint validation                                        | ChoicesControl | Current       |
| REQ-034 | MUST   | A native checkbox must keep a consumer-provided `required`, so a single checkbox in the group can be required on its own.                                                                                          | HTML Standard checkbox state; HTML Standard constraint validation                                        | ChoicesControl | Current       |
| REQ-017 | MUST   | When the field has visible errors, the `role="group"` container must include the error message id in `aria-describedby`.                                                                                           | WAI-ARIA 1.2 `group`; WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 3.3.1                                 | ChoicesControl | Current       |
| REQ-018 | SHOULD | The `role="group"` container should omit `aria-invalid` and `aria-errormessage`, which ARIA 1.2 deprecates on `group`.                                                                                             | WAI-ARIA 1.2 `group`; WAI-ARIA 1.2 `aria-invalid`; WAI-ARIA 1.2 `aria-errormessage`                      | ChoicesControl | Current       |
| REQ-019 | MUST   | Native checkboxes must not have the `readonly` attribute.                                                                                                                                                          | HTML Standard checkbox state                                                                             | ChoicesControl | Current       |
| REQ-020 | MUST   | When the field is readonly, the `role="group"` container must omit `aria-readonly`.                                                                                                                                | WAI-ARIA 1.2 `group`; WAI-ARIA 1.2 `aria-readonly`; axe-core `aria-allowed-attr`[^unsupported-attribute] | ChoicesControl | Current       |
| REQ-028 | MUST   | When the field is loading, each native checkbox must have `disabled`.                                                                                                                                              | HTML Standard disabled form controls; GPRD-008                                                           | ChoicesControl | Current       |
| REQ-039 | MUST   | When the field is readonly, each native checkbox must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `aria-readonly`; ARIA in HTML `input type=checkbox`                                         | ChoicesControl | Current       |
| REQ-042 | MUST   | When the field has no visible errors, the `role="group"` container's `aria-describedby` must not reference the error message.                                                                                      | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 4.1.2                                                       | ChoicesControl | Current       |

### Given Custom Checkbox Items

Semantics only; behaviour belongs to consumers (PRD-003). REQ-001, REQ-003, REQ-004, REQ-017, REQ-018, and REQ-020 cover the `role="group"` container in this mode.

| ID      | Level | Requirement                                                                                                                                                                                                             | Source                                                                   | Surfaces       | Applicability |
| ------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- | ------------- |
| REQ-021 | MUST  | Each custom checkbox item must have `role="checkbox"`.                                                                                                                                                                  | WAI-ARIA 1.2 `checkbox`; WCAG 2.2 SC 4.1.2                               | ChoicesControl | Current       |
| REQ-022 | MUST  | A selected custom checkbox item must have `aria-checked="true"`, and an unselected one must have `aria-checked="false"`.                                                                                                | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `aria-checked`; WCAG 2.2 SC 4.1.2  | ChoicesControl | Current       |
| REQ-023 | MUST  | A disabled custom checkbox item must have `aria-disabled="true"`.                                                                                                                                                       | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2 | ChoicesControl | Current       |
| REQ-024 | MUST  | When the field is readonly, each custom checkbox item must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `checkbox`; WAI-ARIA 1.2 `aria-readonly`                    | ChoicesControl | Current       |
| REQ-025 | MUST  | Pointer and keyboard toggling of custom checkbox items, and blocking it when disabled or readonly, belong to the consumer.                                                                                              | Library policy (PRD-003)                                                 | ChoicesControl | N/A           |

### Given Custom Multi-Select Listbox

| ID      | Level | Requirement                                                                                                                                                                                               | Source                                                                                       | Surfaces       | Applicability |
| ------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------- | ------------- |
| REQ-013 | MUST  | The listbox must have `aria-multiselectable="true"`.                                                                                                                                                      | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-multiselectable`; WCAG 2.2 SC 4.1.2               | ChoicesControl | Current       |
| REQ-005 | MUST  | When the field is required, the listbox must have `aria-required="true"`.                                                                                                                                 | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 4.1.2                      | ChoicesControl | Current       |
| REQ-006 | MUST  | Each option must have `role="option"`, with `aria-selected="true"` when its value is selected and `"false"` otherwise.                                                                                    | WAI-ARIA 1.2 `option`; WAI-ARIA 1.2 `aria-selected`; WCAG 2.2 SC 4.1.2                       | ChoicesControl | Current       |
| REQ-043 | MUST  | A disabled option must have `aria-disabled="true"`.                                                                                                                                                       | WAI-ARIA 1.2 `option`; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2                       | ChoicesControl | Current       |
| REQ-030 | MUST  | Pointer and keyboard toggling of listbox options, and blocking it when disabled, belong to the consumer.                                                                                                  | Library policy (PRD-003)                                                                     | ChoicesControl | N/A           |
| REQ-035 | MUST  | When the field is readonly, the listbox must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-readonly`                                         | ChoicesControl | Current       |
| REQ-036 | MUST  | The listbox's `aria-labelledby` must reference the field label.                                                                                                                                           | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-labelledby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2 | ChoicesControl | Current       |
| REQ-037 | MUST  | When the field has visible errors, the listbox must have `aria-invalid="true"`.                                                                                                                           | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2    | ChoicesControl | Current       |
| REQ-038 | MUST  | When the field has visible errors, the listbox's `aria-errormessage` must reference the error message.                                                                                                    | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1                  | ChoicesControl | Current       |
| REQ-041 | MUST  | When the field has no visible errors, the listbox must not have `aria-errormessage`.                                                                                                                      | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2                                          | ChoicesControl | Current       |

## Prospective

Area: alignment with `docs/ARCHITECTURE.md` and `docs/COMPONENTS.md`. Discovered from those docs; no IDs until confirmed.

| Section                                                                                     | Level | Requirement                                                                                                                                | Source                                                                                                                   | Surfaces       | Applicability | Changes                                                                                                                   |
| ------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Given Custom Checkbox Items, Given Custom Multi-Select Listbox                              | MUST  | The hook gives custom checkbox items and listbox options focus and keyboard toggling, and blocks them when disabled, loading, or readonly. | `docs/ARCHITECTURE.md` "Non-native roots get the required role, focusability, and keyboard behaviour"; WCAG 2.2 SC 2.1.1 | ChoicesControl | Current       | Replaces REQ-025 and REQ-030; needs the keyboard interaction now in Potential scope                                       |
| Given Native Checkbox Group, Given Custom Checkbox Items, Given Custom Multi-Select Listbox | MUST  | When the field is readonly, pointer and keyboard interaction leave the selection unchanged.                                                | WAI-ARIA 1.2 `aria-readonly`                                                                                             | ChoicesControl | Current       | Drops the "consumer's composition keeps the value unchanged" sentence from REQ-024, REQ-035, and REQ-039; changes PRD-007 |
| Product                                                                                     | —     | Checkbox and item options take `disabled`, not `isDisabled`.                                                                               | `docs/COMPONENTS.md` "Keep platform prop names when the platform already defines the concept"                            | ChoicesControl | Current       | New                                                                                                                       |

## Product Requirements

| ID      | Requirement                                                                                                                                                                                                                                                                                                   | Surfaces          | Applicability |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------- |
| PRD-001 | Export `ChoicesControl`, `useChoicesControl`, and their public types from the choices-control package entry point.                                                                                                                                                                                            | ChoicesControl    | Current       |
| PRD-002 | Consumers can associate the group or listbox with a field label, description, and error text.                                                                                                                                                                                                                 | ChoicesControl    | Current       |
| PRD-003 | `ChoicesControl` holds no value state: selection renders only from the consumer's `checked` or `isSelected`.                                                                                                                                                                                                  | ChoicesControl    | Current       |
| PRD-004 | Native multiple-choice render props must be available during server rendering.                                                                                                                                                                                                                                | ChoicesControl    | Current       |
| PRD-005 | Consumers can define group-level selection rules and report their errors through field validation. Consumers own whether those errors block form submission.                                                                                                                                                  | ChoicesControl    | Current       |
| PRD-006 | Native checkbox composition does not accept HTML `readonly` as an item option.                                                                                                                                                                                                                                | ChoicesControl    | Current       |
| PRD-007 | When the field is readonly, `ChoicesControl` passes consumer `onChange` handlers to each checkbox, so a consumer can prevent the change.                                                                                                                                                                      | ChoicesControl    | Current       |
| PRD-008 | When the field is required, custom checkbox items must not have `aria-required`, so assistive technologies do not announce every item as required.                                                                                                                                                            | ChoicesControl    | Current       |
| PRD-009 | When a consumer passes `readOnly` to `ChoicesControl` or a native checkbox option, `ChoicesControl` should strip it from the rendered props and, in development, warn that HTML `readonly` does not apply to these controls and point to `FieldRoot`'s `isReadOnly`.                                          | ChoicesControl    | Current       |
| PRD-010 | `ChoicesControl` passes `useChoicesControl`'s result to its children, so the hook meets every `ChoicesControl` requirement.                                                                                                                                                                                   | useChoicesControl | Current       |
| PRD-011 | When the field is loading, `ChoicesControl` must not call consumer pointer activation handlers, or consumer key handlers for Enter and Space, passed to a custom root or item; the same holds for a disabled item (GPRD-008).                                                                                 | ChoicesControl    | Current       |
| PRD-012 | When a native checkbox fires `change`, `blur`, or `invalid` and `FieldRoot` has no `activeErrors`, the field's active errors must follow that checkbox's `ValidityState`.                                                                                                                                     | ChoicesControl    | Current       |
| PRD-013 | When a consumer reports a validation error through a validity handler's second argument and `FieldRoot` has no `activeErrors`, the field must treat it as an active error; once the field's `errorPolicy` makes it visible, a `role="group"` container meets REQ-017 and a listbox meets REQ-037 and REQ-038. | ChoicesControl    | Current       |
| PRD-014 | Each native checkbox must have the field's `name` by default, and must use a consumer-provided `name` for that checkbox when one is given.                                                                                                                                                                    | ChoicesControl    | Current       |

[^unsupported-attribute]: WAI-ARIA 1.2 does not list this attribute as supported on `group`. We have not found an author-level MUST NOT for unsupported attributes in WAI-ARIA 1.2 or ARIA in HTML, so the spec's own strength is unclear. The MUST follows axe-core: version 4.11 does not allow `aria-required` or `aria-readonly` on `group`, and its `aria-allowed-attr` rule reports them as violations.

## Global Requirements

How the root [`requirements.md`](../../requirements.md) applies to this package.

| ID       | Surfaces            | Applicability |
| -------- | ------------------- | ------------- |
| GPRD-003 | `useChoicesControl` | Current       |
| GPRD-004 | `useChoicesControl` | Current       |
| GPRD-008 | `ChoicesControl`    | Current       |

## Normative Sources

- HTML Standard: [Checkbox state](<https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)>)
- HTML Standard: [`fieldset` element](https://html.spec.whatwg.org/#the-fieldset-element)
- HTML Standard: [`input` element](https://html.spec.whatwg.org/#the-input-element)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- HTML Standard: [Disabled form controls](https://html.spec.whatwg.org/#enabling-and-disabling-form-controls:-the-disabled-attribute)
- WAI-ARIA 1.2: [`group` role](https://www.w3.org/TR/wai-aria-1.2/#group)
- WAI-ARIA 1.2: [`checkbox` role](https://www.w3.org/TR/wai-aria-1.2/#checkbox)
- WAI-ARIA 1.2: [`listbox` role](https://www.w3.org/TR/wai-aria-1.2/#listbox)
- WAI-ARIA 1.2: [`option` role](https://www.w3.org/TR/wai-aria-1.2/#option)
- WAI-ARIA 1.2: [`aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- WAI-ARIA 1.2: [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)
- WAI-ARIA 1.2: [`aria-multiselectable`](https://www.w3.org/TR/wai-aria-1.2/#aria-multiselectable)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- WAI-ARIA 1.2: [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected)
- ARIA in HTML: [`input type=checkbox`](https://www.w3.org/TR/html-aria/#el-input-checkbox)
- WCAG 2.2 SC 1.3.1: [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- WCAG 2.2 SC 2.1.1: [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- WCAG 2.2 SC 3.3.1: [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- WCAG 2.2 SC 3.3.2: [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
