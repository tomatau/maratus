# Field Requirements

## Normative Sources

- HTML Standard: [`label` element](https://html.spec.whatwg.org/multipage/forms.html#the-label-element)
- HTML Standard: [Form control infrastructure](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html)
- HTML Standard: [Constraint validation](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#constraints)
- WAI-ARIA 1.2: [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.2/#aria-describedby)
- WAI-ARIA 1.2: [`aria-details`](https://www.w3.org/TR/wai-aria-1.2/#aria-details)
- WAI-ARIA 1.2: [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage)
- WAI-ARIA 1.2: [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.2/#aria-invalid)
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

### Potential scope

- First-invalid focus management
- Form-level submit and reset coordination
- Native constraint validation display policy
- Detailed supporting content through `aria-details`
- Multiple descriptions or multiple error messages
- External form library adapters

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                                                                                                  | Source                                                                              | Applicability |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | `FieldRoot` must generate document-unique ids for the control, label, description, and error message when consumers do not provide explicit ids.                                                                                                             | WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                                                | Current       |
| REQ-002 | MUST   | `FieldLabel` must associate its label with the field control using the control id.                                                                                                                                                                           | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                 | Current       |
| REQ-003 | MUST   | The field control must expose an `id` that matches the associated `FieldLabel` control reference.                                                                                                                                                            | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                 | Current       |
| REQ-004 | MUST   | When a consumer provides an explicit control `id`, field descendants must use that id for label and relationship wiring.                                                                                                                                     | HTML Standard `label` element; WCAG 2.2 SC 4.1.2                                    | Current       |
| REQ-005 | MUST   | When `FieldRoot` receives description content, `Description` must expose a stable `id` for that content.                                                                                                                                                     | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2               | Current       |
| REQ-006 | MUST   | When `FieldRoot` receives description content, the field control must include the description id in `aria-describedby`.                                                                                                                                      | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                                  | Current       |
| REQ-007 | MUST   | When the field has visible errors, `ErrorMessage` must expose a stable `id` for the rendered error content.                                                                                                                                                  | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | Current       |
| REQ-008 | MUST   | When the field has visible errors, the field control must set `aria-invalid="true"`.                                                                                                                                                                         | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                   | Current       |
| REQ-009 | MUST   | When the field has visible errors, the field control must reference the error id with `aria-errormessage`.                                                                                                                                                   | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | Current       |
| REQ-010 | MUST   | When the field is not invalid, the field control must not set `aria-errormessage` for a hidden or inactive error message.                                                                                                                                    | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2                                 | Current       |
| REQ-011 | SHOULD | When an error message appears after user interaction, `ErrorMessage` should expose `role="alert"` so assistive technologies can announce the message without moving focus.                                                                                   | WAI-ARIA 1.2 `alert`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.3                          | Current       |
| REQ-012 | MUST   | `Control` render props must allow consumers to render native form controls that preserve `name`, `type`, `required`, `disabled`, `readOnly`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `autocomplete`, and browser constraint validation behaviour. | HTML Standard form control infrastructure; HTML Standard constraint validation      | Current       |
| REQ-013 | SHOULD | When `FieldRoot` receives `activeErrors`, those error keys should be the field's current active errors.                                                                                                                                                      | WAI-ARIA 1.2 `aria-invalid`; WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1    | Current       |
| REQ-014 | SHOULD | When `FieldRoot` does not receive `activeErrors`, the field control should derive active error keys from the browser constraint validation API.                                                                                                              | HTML Standard constraint validation; WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1 | Current       |
| REQ-015 | SHOULD | When detailed supporting content is supported, the field control should reference that content with `aria-details`.                                                                                                                                          | WAI-ARIA 1.2 `aria-details`; WCAG 2.2 SC 1.3.1                                      | Potential     |

## Product Requirements

| ID      | Requirement                                                                                                             | Applicability |
| ------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Export `FieldRoot`, `Control`, `Label`, `Description`, and `ErrorMessage` from the field package entry point.           | Current       |
| PRD-002 | Keep field wiring local to React context so copied component code stays understandable.                                 | Current       |
| PRD-003 | `FieldRoot` must accept `label`, `description`, and `errorMap` props as described in the API contract.                  | Current       |
| PRD-004 | `Label`, `Description`, and `ErrorMessage` must render the corresponding content from the closest ancestor `FieldRoot`. | Current       |
| PRD-005 | `FieldRoot` must accept a `name` prop as the minimum field identity input for automatic relationship wiring.            | Current       |
| PRD-006 | Generated field ids must be consistent between server render and client hydration.                                      | Current       |
| PRD-007 | `FieldRoot` must accept `activeErrors` so external form state can provide the current error keys.                       | Current       |
| PRD-008 | `FieldRoot` must accept `errorPolicy` with the argument and return shapes described in the API contract.                | Current       |

## API Contract

```ts
type FieldErrorKey =
  | 'valueMissing'
  | 'typeMismatch'
  | 'patternMismatch'
  | 'tooShort'
  | 'tooLong'
  | 'rangeUnderflow'
  | 'rangeOverflow'
  | 'stepMismatch'
  | 'badInput'
  | 'customError'
  | string

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
  event: 'invalid' | 'blur' | 'input' | 'change'
  isValid: boolean
  isErrorVisible: boolean
  field: FieldErrorPolicyFieldState
  form: FieldErrorPolicyFormState
  activeErrors: readonly FieldErrorKey[]
}

type FieldErrorPolicyResult = false | true | readonly FieldErrorKey[]

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
  activeErrors={externalErrors}
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

- `activeErrors` is controlled state. When present, it supplies the current error keys.
- When `activeErrors` is absent, the field control derives current error keys from `ValidityState`.
- `errorPolicy` receives the current error keys and returns `false` to show none, `true` to show all, or an ordered key list to show a subset.
- Visible errors are active errors that `errorPolicy` allows. A key returned from `errorPolicy` is ignored when that key is not active.
- `ErrorMessage` renders visible error messages by looking up visible error keys in `errorMap`.
- `field.wasBlurred`, `field.wasChanged`, and `field.wasTouched` are field-level event history flags, not value history flags.
- `field.wasErrored` records whether the field has previously shown an error.
- `form.wasSubmitted` is form-level event history when a form context exists, and otherwise defaults to `false`.
- The default policy hides errors while valid, shows errors for validation events, keeps errors visible after the field has previously shown one, and shows errors after an invalid blurred field.
