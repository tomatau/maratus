# Field Requirements

## Normative Sources

- HTML Standard: [`label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- HTML Standard: [`id` attribute](https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-details`](https://www.w3.org/TR/wai-aria-1.2/#aria-details)
- WAI-ARIA 1.2: [`aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- WAI-ARIA 1.2: [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
- WAI-ARIA 1.2: [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly)
- WAI-ARIA 1.2: [`aria-required`](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- WAI-ARIA 1.2: [`alert` role](https://www.w3.org/TR/wai-aria-1.2/#alert)
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
- Field-level required and readonly state for field controls and labels
- Field-level loading state for root and control busy semantics
- Field-level relationship and validity plumbing for value-control packages

### Potential scope

- First-invalid focus management
- Form-level submit and reset coordination
- Native constraint validation display policy
- Detailed supporting content through `aria-details`
- Multiple descriptions or multiple error messages
- External form library adapters

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                         | Source                                                                              | Applicability |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | `FieldRoot` must generate document-unique ids for the control, label, description, and error message when consumers do not provide explicit ids.                                    | HTML Standard `id` attribute; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                  | Current       |
| REQ-002 | MUST   | `Label` must associate its label with the field control using the control id.                                                                                                       | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                 | Current       |
| REQ-003 | MUST   | The field control must expose an `id` that matches the associated `Label` control reference.                                                                                        | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                 | Current       |
| REQ-004 | MUST   | When a consumer provides an explicit control `id`, field descendants must use that id for label and relationship wiring.                                                            | HTML Standard `label` element; WCAG 2.2 SC 4.1.2                                    | Current       |
| REQ-005 | MUST   | When `FieldRoot` receives description content, `Description` must expose a stable `id` for that content.                                                                            | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2               | Current       |
| REQ-006 | MUST   | When `FieldRoot` receives description content, the field control must include the description id in `aria-describedby`.                                                             | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                                  | Current       |
| REQ-007 | MUST   | When the field has visible errors, `ErrorMessage` must expose a stable `id` for the rendered error content.                                                                         | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | Current       |
| REQ-008 | MUST   | When the field has visible errors, the field control must set `aria-invalid="true"`.                                                                                                | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                   | Current       |
| REQ-009 | MUST   | When the field has visible errors, the field control must reference the error id with `aria-errormessage`.                                                                          | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | Current       |
| REQ-010 | MUST   | When the field is not invalid, the field control must not set `aria-errormessage` for a hidden or inactive error message.                                                           | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2                                 | Current       |
| REQ-011 | SHOULD | When an error message appears after user interaction, `ErrorMessage` should expose `role="alert"` so assistive technologies can announce the message without moving focus.          | WAI-ARIA 1.2 `alert`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.3                          | Current       |
| REQ-012 | MUST   | `FieldControl` render props must allow consumers to render native form controls that preserve consumer-provided attributes and browser constraint validation behaviour.             | HTML Standard form control infrastructure; HTML Standard constraint validation      | Current       |
| REQ-014 | SHOULD | When `FieldRoot` does not receive `activeErrors`, the field control should derive active error keys from the browser constraint validation API.                                     | HTML Standard constraint validation; WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1 | Current       |
| REQ-015 | SHOULD | When detailed supporting content is supported, the field control should reference that content with `aria-details`.                                                                 | WAI-ARIA 1.2 `aria-details`; WCAG 2.2 SC 1.3.1                                      | Potential     |
| REQ-016 | MUST   | When `FieldRoot` receives `isRequired`, `FieldControl` render props must expose `aria-required="true"`.                                                                             | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                  | Current       |
| REQ-017 | MUST   | When `FieldRoot` receives `isReadOnly`, `FieldControl` render props must expose `aria-readonly="true"`.                                                                             | WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                                     | Current       |
| REQ-031 | MUST   | When `FieldRoot` receives `isLoading`, the field root and control must expose busy semantics with `aria-busy="true"`, and the control must expose disabled semantics while loading. | WAI-ARIA 1.2 `aria-busy`; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2           | Current       |

## Product Requirements

| ID      | Requirement                                                                                                                                                                                                                             | Applicability |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Export `FieldRoot`, `FieldProvider`, `FieldControl`, `Label`, `Description`, and `ErrorMessage` from the field package entry point.                                                                                                     | Current       |
| PRD-002 | `FieldRoot` must accept `label`, `description`, and `errorMap` props as described in the API contract.                                                                                                                                  | Current       |
| PRD-003 | `Label` and `Description` must render local children when supplied, otherwise render the corresponding content from the closest ancestor `FieldRoot` or `FieldProvider`; `ErrorMessage` must render visible error content from context. | Current       |
| PRD-004 | `FieldRoot` must accept a `name` prop as the minimum field identity input for automatic relationship wiring.                                                                                                                            | Current       |
| PRD-005 | Generated field ids must be consistent between server render and client hydration.                                                                                                                                                      | Current       |
| PRD-006 | `FieldRoot` must accept `activeErrors` so external form state can provide the current error keys.                                                                                                                                       | Current       |
| PRD-007 | `FieldRoot` must accept `errorPolicy` with the argument and return shapes described in the API contract.                                                                                                                                | Current       |
| PRD-008 | `errorPolicy` must receive the event that caused validation state to be evaluated.                                                                                                                                                      | Current       |
| PRD-009 | `errorPolicy` must receive `isValid` and `isErrorVisible` values for the current evaluation.                                                                                                                                            | Current       |
| PRD-010 | `errorPolicy` must receive field event history through `field.wasBlurred`, `field.wasChanged`, `field.wasTouched`, and `field.wasErrored`.                                                                                              | Current       |
| PRD-011 | `errorPolicy` must receive form event history through `form.wasSubmitted`.                                                                                                                                                              | Current       |
| PRD-012 | `ErrorMessage` must accept an optional `renderChildren` prop for each visible error with the message content, CSS module class name, and error key.                                                                                     | Current       |
| PRD-013 | `FieldRoot`, `Description`, and `ErrorMessage` must support root substitution through `as` without changing relationship wiring.                                                                                                        | Current       |
| PRD-015 | `FieldRoot` must accept `isRequired` and `isReadOnly` as field-level state inputs for label and field-control state hooks.                                                                                                              | Current       |
| PRD-016 | When `FieldRoot` receives `isRequired`, `Label` must expose a `data-required` state hook.                                                                                                                                               | Current       |
| PRD-017 | When `FieldRoot` receives `isReadOnly`, `Label` must expose a `data-readonly` state hook.                                                                                                                                               | Current       |
| PRD-018 | Field elements must provide minimal default styles for foreground, spacing, required, readonly, and invalid states.                                                                                                                     | Current       |
| PRD-019 | `FieldRoot` must accept `isLoading` as field-level state for root busy semantics, label state hooks, and field-control busy and disabled semantics.                                                                                     | Current       |
| PRD-020 | `FieldProvider` must support advanced composition by preserving the same field context, generated ids, and relationship wiring used by `FieldRoot`.                                                                                     | Current       |

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

type FieldControlRenderProps = {
  id: string
  'aria-busy'?: boolean
  'aria-describedby'?: string
  'aria-disabled'?: boolean
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

type FieldControlRenderArgs = {
  fieldControlProps: FieldControlRenderProps
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
- Field hooks return named prop bags, such as `fieldRootProps`, `labelProps`, `fieldControlProps`, `descriptionProps`, and `errorMessageProps`.
- `isRequired` and `isReadOnly` are field-level state inputs. `FieldControl` props translate them to ARIA state and label props translate them to `data-required` and `data-readonly`.
- `FieldControl` owns field-level relationship wiring for custom widget roots without selecting a widget role.
- `FieldControl` render props expose `withValidity` next to `fieldControlProps` so value-control packages can wrap events with a `ValidityState`-compatible object and still call the same validity handlers as native controls.
- `field.wasBlurred`, `field.wasChanged`, and `field.wasTouched` are field-level event history flags, not value history flags.
- `field.wasErrored` records whether the field has previously shown an error.
- `form.wasSubmitted` is form-level event history when a form context exists, and otherwise defaults to `false`.
- The default policy hides errors while valid, shows errors for validation events, keeps errors visible after the field has previously shown one, and shows errors after an invalid blurred field.
