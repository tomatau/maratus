# ChoiceControl Requirements

## Scope

### Surfaces

- `ChoiceControl`
- `useChoiceControl`

### Current scope

- Native single-select fields
- Native radio groups in a `role="radiogroup"` container
- Custom radio items in a `role="radiogroup"` container
- Custom single-select listbox fields
- Accessible field labels, descriptions, and error relationships.
- Field-level required, readonly, and loading state translation
- Reporting browser-detected and consumer-defined validation errors.

### Potential scope

- Keyboard roving focus and active descendant management
- Controlled or uncontrolled value state
- Single-select widget wrappers
- Native radio grouping with a `<fieldset>` and its first child `<legend>` as the group caption.

## Accessibility Requirements

### Given Any Root

| ID      | Level  | Requirement                                                                                                                                                                                                                                                                                             | Source                                                            | Surfaces      | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------- | ------------- |
| REQ-025 | MUST   | When the field has a description, the select, radiogroup, or listbox root's `aria-describedby` must reference it.                                                                                                                                                                                       | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                | ChoiceControl | Current       |
| REQ-032 | MUST   | When the field is loading, the select, radiogroup, or listbox root must have `aria-busy="true"`.                                                                                                                                                                                                        | WAI-ARIA 1.2 `aria-busy`; GPRD-008                                | ChoiceControl | Current       |
| REQ-036 | MUST   | When the field is loading, the `role="radiogroup"` or `role="listbox"` container must have `aria-disabled="true"`.                                                                                                                                                                                      | WAI-ARIA 1.2 `aria-disabled`; GPRD-008                            | ChoiceControl | Current       |
| REQ-037 | MUST   | When the field is loading, each custom radio item and listbox option must have `aria-disabled="true"`.                                                                                                                                                                                                  | WAI-ARIA 1.2 `aria-disabled`; GPRD-008                            | ChoiceControl | Current       |
| REQ-048 | MUST   | When a consumer reports a validation error for a custom radio group or listbox through a validity handler's second argument and `FieldRoot` has no `activeErrors`, the field must treat it as an active error; once the field's `errorPolicy` makes it visible, the root must meet REQ-050 and REQ-051. | WCAG 2.2 SC 3.3.1                                                 | ChoiceControl | Current       |
| REQ-050 | MUST   | When the field has visible errors, the select, radiogroup, or listbox root must have `aria-invalid="true"`.                                                                                                                                                                                             | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2 | ChoiceControl | Current       |
| REQ-051 | MUST   | When the field has visible errors, the select, radiogroup, or listbox root's `aria-errormessage` must reference the error message.                                                                                                                                                                      | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1               | ChoiceControl | Current       |
| REQ-052 | SHOULD | When the field is readonly, the select, native radios, custom radio items, and listbox options should not be disabled, so users can still navigate them.                                                                                                                                                | WAI-ARIA 1.2 `aria-readonly`                                      | ChoiceControl | Current       |
| REQ-053 | MUST   | When the field has no visible errors, the select, radiogroup, or listbox root must not have `aria-errormessage`.                                                                                                                                                                                        | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2               | ChoiceControl | Current       |

### Given Native Select Element

| ID      | Level  | Requirement                                                                                                                                                                                              | Source                                                                               | Surfaces      | Applicability |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------- | ------------- |
| REQ-001 | MUST   | The label's `for` must match the select's `id`.                                                                                                                                                          | HTML Standard `label`; HTML Standard `select`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2  | ChoiceControl | Current       |
| REQ-002 | MUST   | The select's `name` must match the configured field name.                                                                                                                                                | HTML Standard form control infrastructure                                            | ChoiceControl | Current       |
| REQ-003 | MUST   | A required select must have the `required` attribute.                                                                                                                                                    | HTML Standard `select`; HTML Standard form control infrastructure; WCAG 2.2 SC 3.3.2 | ChoiceControl | Current       |
| REQ-004 | SHOULD | Omit an explicit `role`.                                                                                                                                                                                 | ARIA in HTML `select`; WCAG 2.2 SC 4.1.2                                             | ChoiceControl | Current       |
| REQ-005 | SHOULD | Omit `aria-required` when `required` is present.                                                                                                                                                         | HTML Standard `select`; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 4.1.2              | ChoiceControl | Current       |
| REQ-006 | MUST   | When the field is readonly, the select must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `aria-readonly`; ARIA in HTML `select`                                  | ChoiceControl | Current       |
| REQ-033 | MUST   | When the field is loading, the select must have `disabled`.                                                                                                                                              | HTML Standard disabled form controls; GPRD-008                                       | ChoiceControl | Current       |
| REQ-034 | SHOULD | When the field is loading, the select should not have `aria-disabled`.                                                                                                                                   | ARIA in HTML `disabled` attribute                                                    | ChoiceControl | Current       |
| REQ-038 | MUST   | Pointer interaction can pick any enabled option of an enabled, editable select (the field is not readonly), and picking it clears the previous selection.                                                | HTML Standard `select`                                                               | ChoiceControl | Current       |
| REQ-039 | MUST   | Keyboard users can pick any enabled option of an editable select (the field is not readonly) using the browser's native select interaction.                                                              | WCAG 2.2 SC 2.1.1                                                                    | ChoiceControl | Current       |
| REQ-040 | MUST   | Pointer interaction cannot change a disabled select.                                                                                                                                                     | HTML Standard `select`; HTML Standard disabled form controls                         | ChoiceControl | Current       |
| REQ-041 | MUST   | Keyboard interaction cannot change a disabled select.                                                                                                                                                    | HTML Standard `select`; HTML Standard disabled form controls                         | ChoiceControl | Current       |
| REQ-046 | MUST   | When the select fires `change`, `blur`, or `invalid` and `FieldRoot` has no `activeErrors`, the field's active errors must follow the select's `ValidityState`.                                          | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1                               | ChoiceControl | Current       |

### Given Native Radio Group

| ID      | Level  | Requirement                                                                                                                                                                                                                     | Source                                                                                        | Surfaces      | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------- | ------------- |
| REQ-007 | MUST   | The radios' grouping must be programmatically determinable. Current: a `role="radiogroup"` container. Allowed alternative: a `fieldset` whose first child `legend` is the group caption (Potential).                            | WCAG 2.2 SC 1.3.1; WAI-ARIA 1.2 `radiogroup`; HTML Standard `fieldset`                        | ChoiceControl | Current       |
| REQ-008 | MUST   | The group's `aria-labelledby` must reference the field label's `id`.                                                                                                                                                            | WAI-ARIA 1.2 `aria-labelledby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                          | ChoiceControl | Current       |
| REQ-009 | MUST   | Each option must be an `input` with `type="radio"`.                                                                                                                                                                             | HTML Standard radio state; WCAG 2.2 SC 4.1.2                                                  | ChoiceControl | Current       |
| REQ-010 | SHOULD | Omit an explicit `role` on each radio.                                                                                                                                                                                          | ARIA in HTML `input type=radio`; WCAG 2.2 SC 4.1.2                                            | ChoiceControl | Current       |
| REQ-011 | MUST   | The radios must share the same `name`.                                                                                                                                                                                          | HTML Standard radio state; HTML Standard form control infrastructure                          | ChoiceControl | Current       |
| REQ-012 | MUST   | Each radio must preserve its submitted `value`.                                                                                                                                                                                 | HTML Standard radio state; HTML Standard form control infrastructure                          | ChoiceControl | Current       |
| REQ-013 | MUST   | The selected radio's `checked` property must be `true`, and the others' must be `false`.                                                                                                                                        | HTML Standard radio state; WCAG 2.2 SC 4.1.2                                                  | ChoiceControl | Current       |
| REQ-014 | MUST   | When the group is required, each radio must have the `required` attribute.                                                                                                                                                      | HTML Standard radio state; HTML Standard form control infrastructure; WCAG 2.2 SC 3.3.2       | ChoiceControl | Current       |
| REQ-015 | MUST   | A disabled radio must have the `disabled` attribute.                                                                                                                                                                            | HTML Standard radio state; HTML Standard form control infrastructure; WCAG 2.2 SC 4.1.2       | ChoiceControl | Current       |
| REQ-021 | MUST   | When pointer activation selects a radio in an editable group (the field is not readonly), the previous selection in the same group clears.                                                                                      | HTML Standard `input`; HTML Standard radio state                                              | ChoiceControl | Current       |
| REQ-022 | MUST   | Keyboard users can select any enabled radio in an editable group (the field is not readonly) using the browser's native radio interaction.                                                                                      | WCAG 2.2 SC 2.1.1                                                                             | ChoiceControl | Current       |
| REQ-023 | MUST   | Clicking a disabled radio cannot select it.                                                                                                                                                                                     | HTML Standard disabled form controls                                                          | ChoiceControl | Current       |
| REQ-024 | MUST   | Keyboard interaction cannot select a disabled radio.                                                                                                                                                                            | HTML Standard disabled form controls                                                          | ChoiceControl | Current       |
| REQ-026 | MUST   | Native radios must not have the `readonly` attribute.                                                                                                                                                                           | HTML Standard radio state                                                                     | ChoiceControl | Current       |
| REQ-027 | MUST   | When the field is readonly, the `role="radiogroup"` container must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `radiogroup`; WAI-ARIA 1.2 `aria-readonly`                                       | ChoiceControl | Current       |
| REQ-035 | MUST   | When the field is loading, each native radio must have `disabled`.                                                                                                                                                              | HTML Standard disabled form controls; GPRD-008                                                | ChoiceControl | Current       |
| REQ-043 | MUST   | When the field is required, the `role="radiogroup"` container must have `aria-required="true"`.                                                                                                                                 | WAI-ARIA 1.2 `radiogroup`; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2 | ChoiceControl | Current       |
| REQ-047 | MUST   | When a native radio fires `change`, `blur`, or `invalid` and `FieldRoot` has no `activeErrors`, the field's active errors must follow that radio's `ValidityState`.                                                             | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1                                        | ChoiceControl | Current       |

### Given Custom Radio Items

Semantics only, as in `boolean-control` and `text-control`; behaviour belongs to consumers (PRD-004). REQ-007, REQ-008, REQ-027, and REQ-043 cover the `role="radiogroup"` container in this mode.

| ID      | Level | Requirement                                                                                                      | Source                                                                                   | Surfaces      | Applicability |
| ------- | ----- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------- | ------------- |
| REQ-028 | MUST  | Each custom radio item must have `role="radio"`.                                                                 | WAI-ARIA 1.2 `radio`; WCAG 2.2 SC 4.1.2                                                  | ChoiceControl | Current       |
| REQ-029 | MUST  | The selected custom radio item must have `aria-checked="true"`, and the others must have `aria-checked="false"`. | WAI-ARIA 1.2 `radio`; WAI-ARIA 1.2 `aria-checked`; WCAG 2.2 SC 4.1.2                     | ChoiceControl | Current       |
| REQ-030 | MUST  | A disabled custom radio item must have `aria-disabled="true"`.                                                   | WAI-ARIA 1.2 `radio`; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2                    | ChoiceControl | Current       |
| REQ-031 | MUST  | Pointer and keyboard selection of custom radio items, and blocking it when disabled, belong to the consumer.     | Library policy (PRD-004)                                                                 | ChoiceControl | N/A           |
| REQ-045 | MUST  | Custom radio items must not have `aria-required`.                                                                | WAI-ARIA 1.2 `radio`; WAI-ARIA 1.2 `aria-required`; Library policy[^radio-aria-required] | ChoiceControl | Current       |

### Given Custom Listbox

| ID      | Level | Requirement                                                                                                                                                                                                                  | Source                                                                                     | Surfaces      | Applicability |
| ------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------- | ------------- |
| REQ-016 | MUST  | The listbox must have `role="listbox"`.                                                                                                                                                                                      | WAI-ARIA 1.2 `listbox`; WCAG 2.2 SC 4.1.2                                                  | ChoiceControl | Current       |
| REQ-017 | MUST  | The listbox's `aria-labelledby` must reference its label.                                                                                                                                                                    | WAI-ARIA 1.2 `aria-labelledby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                       | ChoiceControl | Current       |
| REQ-018 | MUST  | Each option must have `role="option"`.                                                                                                                                                                                       | WAI-ARIA 1.2 `option`; WCAG 2.2 SC 4.1.2                                                   | ChoiceControl | Current       |
| REQ-019 | MUST  | The selected option must have `aria-selected="true"`, and the others must have `aria-selected="false"`.                                                                                                                      | WAI-ARIA 1.2 `option`; WAI-ARIA 1.2 `aria-selected`; WCAG 2.2 SC 4.1.2                     | ChoiceControl | Current       |
| REQ-020 | MUST  | A disabled option must have `aria-disabled="true"`.                                                                                                                                                                          | WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2                                            | ChoiceControl | Current       |
| REQ-042 | MUST  | Pointer and keyboard selection of listbox options, and blocking it when disabled, belong to the consumer.                                                                                                                    | Library policy (PRD-004)                                                                   | ChoiceControl | N/A           |
| REQ-044 | MUST  | When the field is required, the `role="listbox"` container must have `aria-required="true"`.                                                                                                                                 | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2 | ChoiceControl | Current       |
| REQ-049 | MUST  | When the field is readonly, the `role="listbox"` container must have `aria-readonly="true"`. Setting the field readonly declares that the consumer's composition keeps the value unchanged under pointer and keyboard input. | WAI-ARIA 1.2 `listbox`; WAI-ARIA 1.2 `aria-readonly`                                       | ChoiceControl | Current       |

## Product Requirements

| ID      | Requirement                                                                                                                                                                                                                                                     | Surfaces         | Applicability |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- |
| PRD-001 | Export `ChoiceControl`, `useChoiceControl`, and their public types from the choice-control package entry point.                                                                                                                                                 | ChoiceControl    | Current       |
| PRD-002 | Support native select and radio composition as the primary single-choice authoring path.                                                                                                                                                                        | ChoiceControl    | Current       |
| PRD-003 | Support custom listbox composition for consumers that need non-native single-choice widgets.                                                                                                                                                                    | ChoiceControl    | Current       |
| PRD-004 | `ChoiceControl` holds no value state: selection renders only from the consumer's `checked`, `value`, or `isSelected`.                                                                                                                                           | ChoiceControl    | Current       |
| PRD-005 | Native radio composition does not accept HTML `readonly` as an item option.                                                                                                                                                                                     | ChoiceControl    | Current       |
| PRD-006 | When the field is readonly, `ChoiceControl` passes consumer `onChange` handlers to each radio, so a consumer can prevent the change.                                                                                                                            | ChoiceControl    | Current       |
| PRD-007 | When the field is readonly, `ChoiceControl` passes consumer `onChange` handlers to the select, so a controlled consumer can keep its value.                                                                                                                     | ChoiceControl    | Current       |
| PRD-008 | When a consumer passes `readOnly` to `ChoiceControl` or a native radio option, `ChoiceControl` should strip it from the rendered props and, in development, warn that HTML `readonly` does not apply to these controls and point to `FieldRoot`'s `isReadOnly`. | ChoiceControl    | Current       |
| PRD-009 | Native single-choice render props must be available during server rendering.                                                                                                                                                                                    | ChoiceControl    | Current       |
| PRD-010 | `ChoiceControl` passes `useChoiceControl`'s result to its children, so the hook meets every `ChoiceControl` requirement.                                                                                                                                        | useChoiceControl | Current       |
| PRD-011 | When the field is loading, `ChoiceControl` must not call consumer pointer activation handlers, or consumer key handlers for Enter and Space, passed to a custom root or item; the same holds for a disabled item (GPRD-008).                                    | ChoiceControl    | Current       |

[^radio-aria-required]: WAI-ARIA 1.2 neither supports nor inherits `aria-required` on `radio`. We have not found an author-level MUST NOT for unsupported attributes in WAI-ARIA 1.2 or ARIA in HTML, so the spec's own strength is unclear, and axe-core 4.11 allows `aria-required` on `radio`. The MUST is library policy, matching PRD-008 in `choices-control`: assistive technologies should not announce every item as required.

## Normative Sources

- HTML Standard: [`select` element](https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element)
- HTML Standard: [Radio Button state](<https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)>)
- HTML Standard: [`label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- HTML Standard: [`fieldset` element](https://html.spec.whatwg.org/#the-fieldset-element)
- HTML Standard: [`input` element](https://html.spec.whatwg.org/#the-input-element)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- HTML Standard: [Disabled form controls](https://html.spec.whatwg.org/#enabling-and-disabling-form-controls:-the-disabled-attribute)
- WAI-ARIA 1.2: [`radiogroup` role](https://www.w3.org/TR/wai-aria-1.2/#radiogroup)
- WAI-ARIA 1.2: [`listbox` role](https://www.w3.org/TR/wai-aria-1.2/#listbox)
- WAI-ARIA 1.2: [`radio` role](https://www.w3.org/TR/wai-aria-1.2/#radio)
- WAI-ARIA 1.2: [`option` role](https://www.w3.org/TR/wai-aria-1.2/#option)
- WAI-ARIA 1.2: [`aria-checked`](https://www.w3.org/TR/wai-aria-1.2/#aria-checked)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- WAI-ARIA 1.2: [`aria-selected`](https://www.w3.org/TR/wai-aria-1.2/#aria-selected)
- ARIA in HTML: [`select` element](https://www.w3.org/TR/html-aria/#el-select)
- ARIA in HTML: [`input type=radio`](https://www.w3.org/TR/html-aria/#el-input-radio)
- ARIA in HTML: [`readonly` attribute](https://www.w3.org/TR/html-aria/#att-readonly)
- ARIA in HTML: [`disabled` attribute](https://www.w3.org/TR/html-aria/#att-disabled)
- WAI-ARIA 1.2: [`aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- WCAG 2.2 SC 1.3.1: [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- WCAG 2.2 SC 2.1.1: [Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- WCAG 2.2 SC 3.3.1: [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- WCAG 2.2 SC 3.3.2: [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
