# Field Requirements

## Normative Sources

- HTML Standard: [`label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-details`](https://www.w3.org/TR/wai-aria-1.2/#aria-details)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- WAI-ARIA 1.2: [`alert` role](https://www.w3.org/TR/wai-aria-1.2/#alert)
- WAI-ARIA 1.2: [`checkbox` role](https://www.w3.org/TR/wai-aria-1.2/#checkbox)
- WAI-ARIA 1.2: [`combobox` role](https://www.w3.org/TR/wai-aria-1.2/#combobox)
- WAI-ARIA 1.2: [`listbox` role](https://www.w3.org/TR/wai-aria-1.2/#listbox)
- WAI-ARIA 1.2: [`searchbox` role](https://www.w3.org/TR/wai-aria-1.2/#searchbox)
- WAI-ARIA 1.2: [`spinbutton` role](https://www.w3.org/TR/wai-aria-1.2/#spinbutton)
- WAI-ARIA 1.2: [`textbox` role](https://www.w3.org/TR/wai-aria-1.2/#textbox)
- WCAG 2.2 SC 1.3.1: [Info and Relationships](https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html)
- WCAG 2.2 SC 3.3.1: [Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html)
- WCAG 2.2 SC 3.3.2: [Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- WCAG 2.2 SC 4.1.3: [Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)

## Scope

### Current scope

- Field-local context for form control relationships
- Stable SSR-safe ids
- Label and control association
- Description association
- Error message association
- Invalid state wiring
- Field-level required and readonly state for native controls
- Role-aware non-native controls for custom widgets

### Potential scope

- First-invalid focus management
- Form-level submit and reset coordination
- Native constraint validation display policy
- Detailed supporting content through `aria-details`
- Multiple descriptions or multiple error messages
- External form library adapters

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                                                                                                  | Source                                                                                       | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | `FieldRoot` must generate document-unique ids for the control, label, description, and error message when consumers do not provide explicit ids.                                                                                                             | WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                                                         | Current       |
| REQ-002 | MUST   | `FieldLabel` must associate its label with the field control using the control id.                                                                                                                                                                           | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                          | Current       |
| REQ-003 | MUST   | The field control must expose an `id` that matches the associated `FieldLabel` control reference.                                                                                                                                                            | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                          | Current       |
| REQ-004 | MUST   | When a consumer provides an explicit control `id`, field descendants must use that id for label and relationship wiring.                                                                                                                                     | HTML Standard `label` element; WCAG 2.2 SC 4.1.2                                             | Current       |
| REQ-005 | MUST   | When `FieldRoot` receives description content, `Description` must expose a stable `id` for that content.                                                                                                                                                     | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                        | Current       |
| REQ-006 | MUST   | When `FieldRoot` receives description content, the field control must include the description id in `aria-describedby`.                                                                                                                                      | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                                           | Current       |
| REQ-007 | MUST   | When the field has visible errors, `ErrorMessage` must expose a stable `id` for the rendered error content.                                                                                                                                                  | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                       | Current       |
| REQ-008 | MUST   | When the field has visible errors, the field control must set `aria-invalid="true"`.                                                                                                                                                                         | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                            | Current       |
| REQ-009 | MUST   | When the field has visible errors, the field control must reference the error id with `aria-errormessage`.                                                                                                                                                   | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                       | Current       |
| REQ-010 | MUST   | When the field is not invalid, the field control must not set `aria-errormessage` for a hidden or inactive error message.                                                                                                                                    | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2                                          | Current       |
| REQ-011 | SHOULD | When an error message appears after user interaction, `ErrorMessage` should expose `role="alert"` so assistive technologies can announce the message without moving focus.                                                                                   | WAI-ARIA 1.2 `alert`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.3                                   | Current       |
| REQ-012 | MUST   | `Control` render props must allow consumers to render native form controls that preserve `name`, `type`, `required`, `disabled`, `readOnly`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `autocomplete`, and browser constraint validation behaviour. | HTML Standard form control infrastructure; HTML Standard constraint validation               | Current       |
| REQ-013 | SHOULD | When `FieldRoot` receives `activeErrors`, those error keys should be the field's current active errors.                                                                                                                                                      | WAI-ARIA 1.2 `aria-invalid`; WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1             | Current       |
| REQ-014 | SHOULD | When `FieldRoot` does not receive `activeErrors`, the field control should derive active error keys from the browser constraint validation API.                                                                                                              | HTML Standard constraint validation; WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1          | Current       |
| REQ-015 | SHOULD | When detailed supporting content is supported, the field control should reference that content with `aria-details`.                                                                                                                                          | WAI-ARIA 1.2 `aria-details`; WCAG 2.2 SC 1.3.1                                               | Potential     |
| REQ-016 | MUST   | When `FieldRoot` receives `isRequired`, `Control` render props must expose `required` for native controls so browser required semantics and validation remain available.                                                                                     | HTML Standard form control infrastructure; HTML Standard constraint validation               | Current       |
| REQ-017 | MUST   | When `FieldRoot` receives `isReadOnly`, `Control` render props must expose `readOnly` for the native controls listed in [Native readonly controls](#native-readonly-controls).                                                                               | HTML Standard form control infrastructure; WCAG 2.2 SC 4.1.2                                 | Current       |
| REQ-018 | SHOULD | When `FieldRoot` receives `isRequired`, `Label` should expose a `data-required` state hook.                                                                                                                                                                  | WCAG 2.2 SC 3.3.2                                                                            | Current       |
| REQ-019 | SHOULD | When `FieldRoot` receives `isReadOnly`, `Label` should expose a `data-readonly` state hook.                                                                                                                                                                  | WCAG 2.2 SC 4.1.2                                                                            | Current       |
| REQ-020 | MUST   | When role-aware non-native controls are supported, `Control` must limit supported widget roles to `textbox`, `searchbox`, `spinbutton`, `combobox`, `listbox`, and `checkbox`.                                                                               | WAI-ARIA 1.2 widget roles; WCAG 2.2 SC 4.1.2                                                 | Current       |
| REQ-021 | MUST   | When `Control` renders a role-aware non-native control, the render props must expose the requested supported `role` and preserve field relationship attributes.                                                                                              | WAI-ARIA 1.2 widget roles; WAI-ARIA 1.2 `aria-describedby`; WAI-ARIA 1.2 `aria-errormessage` | Current       |
| REQ-022 | MUST   | When a role-aware non-native control is required, `Control` render props must expose `aria-required="true"` only for roles marked required-capable in [Supported non-native control roles](#supported-non-native-control-roles).                             | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                           | Current       |
| REQ-023 | MUST   | When a role-aware non-native control is readonly, `Control` render props must expose `aria-readonly="true"` only for roles marked readonly-capable in [Supported non-native control roles](#supported-non-native-control-roles).                             | WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                                              | Current       |
| REQ-024 | MUST   | When `Control` renders a non-native `textbox` or `searchbox`, it must require or pass through the text entry attributes listed for that role in [Role-specific control contracts](#role-specific-control-contracts).                                         | WAI-ARIA 1.2 `textbox`; WAI-ARIA 1.2 `searchbox`; WCAG 2.2 SC 4.1.2                          | Current       |
| REQ-025 | MUST   | When `Control` renders a non-native `spinbutton`, it must require or pass through the value attributes listed for that role in [Role-specific control contracts](#role-specific-control-contracts).                                                          | WAI-ARIA 1.2 `spinbutton`; WCAG 2.2 SC 4.1.2                                                 | Current       |
| REQ-026 | MUST   | When `Control` renders a non-native `combobox`, it must require or pass through the popup relationship attributes listed for that role in [Role-specific control contracts](#role-specific-control-contracts).                                               | WAI-ARIA 1.2 `combobox`; WCAG 2.2 SC 4.1.2                                                   | Current       |
| REQ-027 | MUST   | When `Control` renders a non-native `listbox`, it must require or pass through the option relationship attributes listed for that role in [Role-specific control contracts](#role-specific-control-contracts).                                               | WAI-ARIA 1.2 `listbox`; WCAG 2.2 SC 4.1.2                                                    | Current       |
| REQ-028 | MUST   | When `Control` renders a non-native `checkbox`, it must require or pass through the checked state attributes listed for that role in [Role-specific control contracts](#role-specific-control-contracts).                                                    | WAI-ARIA 1.2 `checkbox`; WCAG 2.2 SC 4.1.2                                                   | Current       |
| REQ-029 | SHOULD | When a role-aware control is rendered with a native element that exposes `ValidityState`, `Control` render props should keep native validity handlers available.                                                                                            | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1                                       | Current       |
| REQ-030 | SHOULD | When a role-aware control is rendered with a custom element that does not expose `ValidityState`, `Control` render props should expose a validity event wrapper that lets consumers pass custom validity state through the same validity handlers.           | HTML Standard constraint validation; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                   | Current       |

## Requirement Details

### Native readonly controls

`readOnly` applies to these native controls when `FieldRoot` receives `isReadOnly`:

| Native control | Supported forms                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `input`        | `text`, `search`, `url`, `tel`, `email`, `password`, `date`, `month`, `week`, `time`, `datetime-local`, `number` |
| `textarea`     | All `textarea` controls                                                                                          |

`readOnly` must not be used as the Field-controlled readonly output for native controls that do not support readonly state, including `select`, `input[type="checkbox"]`, `input[type="radio"]`, `input[type="range"]`, `input[type="file"]`, `input[type="color"]`, and button input types.

### Supported non-native control roles

| Role         | Required-capable | Readonly-capable | Notes                                                     |
| ------------ | ---------------- | ---------------- | --------------------------------------------------------- |
| `textbox`    | Yes              | Yes              | Text entry widget.                                        |
| `searchbox`  | Yes              | Yes              | Text entry widget with search semantics.                  |
| `spinbutton` | Yes              | Yes              | Numeric value widget with role-specific value attributes. |
| `combobox`   | Yes              | Yes              | Composite widget that controls a popup.                   |
| `listbox`    | Yes              | Yes              | Selectable option collection.                             |
| `checkbox`   | Yes              | Yes              | Checkable widget with role-specific checked state.        |

### Role-specific control contracts

| Role         | Field-provided attributes                                                                               | Consumer-provided or pass-through attributes required for a complete widget contract                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `textbox`    | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | Editable behaviour through `contentEditable` or equivalent, plus `aria-multiline` when multiline.                                                               |
| `searchbox`  | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | Editable behaviour through `contentEditable` or equivalent.                                                                                                     |
| `spinbutton` | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | `aria-valuenow`, plus `aria-valuemin`, `aria-valuemax`, or `aria-valuetext` when needed to expose the value range or user-friendly value.                       |
| `combobox`   | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | `aria-expanded`, plus `aria-controls`, `aria-haspopup`, `aria-activedescendant`, and `aria-autocomplete` when required by the popup and autocomplete behaviour. |
| `listbox`    | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | Owned or referenced `option` elements, selection state such as `aria-selected`, and `aria-activedescendant` when focus remains on the listbox.                  |
| `checkbox`   | `role`, `id`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-required`, `aria-readonly` | `aria-checked`, with keyboard and pointer interaction that updates the checked state.                                                                           |

## Product Requirements

| ID      | Requirement                                                                                                                                         | Applicability |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Export `FieldRoot`, `Control`, `Label`, `Description`, and `ErrorMessage` from the field package entry point.                                       | Current       |
| PRD-002 | `FieldRoot` must accept `label`, `description`, and `errorMap` props as described in the API contract.                                              | Current       |
| PRD-003 | `Label`, `Description`, and `ErrorMessage` must render the corresponding content from the closest ancestor `FieldRoot`.                             | Current       |
| PRD-004 | `FieldRoot` must accept a `name` prop as the minimum field identity input for automatic relationship wiring.                                        | Current       |
| PRD-005 | Generated field ids must be consistent between server render and client hydration.                                                                  | Current       |
| PRD-006 | `FieldRoot` must accept `activeErrors` so external form state can provide the current error keys.                                                   | Current       |
| PRD-007 | `FieldRoot` must accept `errorPolicy` with the argument and return shapes described in the API contract.                                            | Current       |
| PRD-008 | `errorPolicy` must receive the event that caused validation state to be evaluated.                                                                  | Current       |
| PRD-009 | `errorPolicy` must receive `isValid` and `isErrorVisible` values for the current evaluation.                                                        | Current       |
| PRD-010 | `errorPolicy` must receive field event history through `field.wasBlurred`, `field.wasChanged`, `field.wasTouched`, and `field.wasErrored`.          | Current       |
| PRD-011 | `errorPolicy` must receive form event history through `form.wasSubmitted`.                                                                          | Current       |
| PRD-012 | `ErrorMessage` must accept an optional `renderChildren` prop for each visible error with the message content, CSS module class name, and error key. | Current       |
| PRD-013 | `FieldRoot`, `Description`, and `ErrorMessage` must support root substitution through `as` without changing relationship wiring.                    | Current       |
| PRD-015 | `FieldRoot` must accept `isRequired` and `isReadOnly` as field-level state inputs for label state hooks and native control props.                   | Current       |
| PRD-016 | `Control` should support role-aware non-native widgets through an explicit supported role API.                                                      | Current       |
| PRD-018 | Field elements must provide minimal default styles for foreground, spacing, required, readonly, and invalid states.                                  | Current       |

## API Contract

```ts
type ValidityErrorKey = Exclude<keyof ValidityState, 'valid'>

type FieldErrorKey = ValidityErrorKey | (string & {})

type FieldErrorMap = ReadonlyMap<FieldErrorKey, React.ReactNode>

type FieldErrorPolicyFieldState = {
  wasBlurred: boolean
  wasChanged: boolean
  wasTouched: boolean
  wasErrored: boolean
}

type FieldErrorPolicyFormState = {
  wasSubmitted: boolean
}

type FieldErrorPolicyArgs = {
  event: 'invalid' | 'blur' | 'focus' | 'input' | 'change'
  isValid: boolean
  isErrorVisible: boolean
  field: FieldErrorPolicyFieldState
  form: FieldErrorPolicyFormState
  activeErrors: ReadonlySet<FieldErrorKey>
}

type FieldErrorPolicyResult = false | true | readonly FieldErrorKey[]

type ErrorMessageItemProps = {
  children: React.ReactNode
  className: string
  errorKey: FieldErrorKey
  key: FieldErrorKey
}

type ErrorMessageProps = {
  as?: React.ElementType
  children?: never
  renderChildren?: (props: ErrorMessageItemProps) => React.ReactNode
}

type ControlRole =
  | 'checkbox'
  | 'combobox'
  | 'listbox'
  | 'searchbox'
  | 'spinbutton'
  | 'textbox'

type ControlRenderProps = {
  id: string
  name?: string
  role?: ControlRole
  required?: boolean
  readOnly?: boolean
  'aria-describedby'?: string
  'aria-errormessage'?: string
  'aria-invalid'?: boolean
  'aria-required'?: boolean
  'aria-readonly'?: boolean
  onBlur?: React.FocusEventHandler
  onChange?: React.ChangeEventHandler
  onFocus?: React.FocusEventHandler
  onInput?: React.ReactEventHandler
  onInvalid?: React.ReactEventHandler
}

type WithValidity = <TEvent extends { currentTarget: EventTarget }>(
  event: TEvent,
  validity: Partial<ValidityState>,
) => TEvent & {
  currentTarget: TEvent['currentTarget'] & {
    validity: ValidityState
  }
}

type ControlRenderArgs = {
  controlProps: ControlRenderProps
  withValidity: WithValidity
}

const defaultErrorPolicy = (args: FieldErrorPolicyArgs) => {
  if (args.isValid) return false
  if (args.event === 'invalid') return true
  if (args.field.wasErrored) return true
  if (args.field.wasBlurred) return true
  return false
}
```

`FieldRoot` is the source for field content that must affect server-rendered relationship attributes:

```tsx
<FieldRoot
  name="email"
  label="Email"
  description="Used for receipts."
  errorMap={
    new Map([
      ['valueMissing', 'Enter your email.'],
      ['typeMismatch', 'Enter a valid email.'],
    ])
  }
  activeErrors={new Set(['valueMissing'])}
  errorPolicy={fieldErrorPolicy}
>
  <Label />
  <Input
    type="email"
    required
  />
  <Description />
  <ErrorMessage />
</FieldRoot>
```

- `activeErrors` is controlled state. When present, it supplies the current error keys as a `ReadonlySet<FieldErrorKey>`.
- When `activeErrors` is absent, the field control derives current error keys from `ValidityState`.
- `errorPolicy` receives the current error key set and returns `false` to show none, `true` to show all, or an ordered key list to show a subset.
- Visible errors are active errors that `errorPolicy` allows. A key returned from `errorPolicy` is ignored when that key is not active.
- `ErrorMessage` renders visible error messages by looking up visible error keys in `errorMap`.
- `ErrorMessage` renders each visible error with a `p` element by default, and consumers can replace that element with `renderChildren`.
- Field CSS uses component-scoped variables for minimal foreground, spacing, required, readonly, and invalid state styles.
- `FieldRoot`, `Description`, and `ErrorMessage` accept `as` for root substitution; `Label` does not, because the native `label` element provides the field association behaviour.
- Field hooks return named prop bags, such as `fieldRootProps`, `labelProps`, `controlProps`, `descriptionProps`, and `errorMessageProps`.
- `isRequired` and `isReadOnly` are field-level state inputs. Native control render props translate them to `required` and `readOnly`; label props translate them to `data-required` and `data-readonly`.
- Role-aware non-native controls are current scope. They must map `isRequired` and `isReadOnly` through `aria-required` and `aria-readonly` only when the selected role supports those states.
- Supported non-native control roles are intentionally narrow: `textbox`, `searchbox`, `spinbutton`, `combobox`, `listbox`, and `checkbox`.
- `Control` render props expose `withValidity` next to `controlProps` so custom controls can wrap events with a `ValidityState`-compatible object and still call the same validity handlers as native controls.
- `field.wasBlurred`, `field.wasChanged`, and `field.wasTouched` are field-level event history flags, not value history flags.
- `field.wasErrored` records whether the field has previously shown an error.
- `form.wasSubmitted` is form-level event history when a form context exists, and otherwise defaults to `false`.
- The default policy hides errors while valid, shows errors for validation events, keeps errors visible after the field has previously shown one, and shows errors after an invalid blurred field.
