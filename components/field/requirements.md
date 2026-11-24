# Field Requirements

## Scope

### Surfaces

- `FieldRoot`
- `FieldProvider`
- `FieldControl`
- `Label`
- `Description`
- `ErrorMessage`
- `useFieldRoot`
- `useFieldControl`
- `useLabel`
- `useDescription`
- `useErrorMessage`

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
- Field validity and event history in a runtime store, readable outside the field tree (for example, for analytics)

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                         | Source                                                                              | Surfaces                | Applicability |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------------- |
| REQ-001 | MUST   | `FieldRoot` must generate document-unique ids for the control, label, description, and error message when consumers do not provide explicit ids.                                    | HTML Standard `id` attribute; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                  | FieldRoot               | Current       |
| REQ-002 | MUST   | `Label` must associate its label with the field control using the control id.                                                                                                       | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2                 | Label                   | Current       |
| REQ-003 | MUST   | The field control must expose an `id` that matches the associated `Label` control reference.                                                                                        | HTML Standard `label` element; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 4.1.2                 | FieldControl            | Current       |
| REQ-004 | MUST   | When a consumer provides an explicit control `id`, field descendants must use that id for label and relationship wiring.                                                            | HTML Standard `label` element; WCAG 2.2 SC 4.1.2                                    | FieldRoot               | Current       |
| REQ-005 | MUST   | When `FieldRoot` receives description content, `Description` must expose a stable `id` for that content.                                                                            | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1; WCAG 2.2 SC 3.3.2               | Description             | Current       |
| REQ-006 | MUST   | When `FieldRoot` receives description content, the field control must include the description id in `aria-describedby`.                                                             | WAI-ARIA 1.2 `aria-describedby`; WCAG 2.2 SC 1.3.1                                  | FieldControl            | Current       |
| REQ-007 | MUST   | When the field has visible errors, `ErrorMessage` must expose a stable `id` for the rendered error content.                                                                         | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | ErrorMessage            | Current       |
| REQ-008 | MUST   | When the field has visible errors, the field control must set `aria-invalid="true"`.                                                                                                | WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2                   | FieldControl            | Current       |
| REQ-009 | MUST   | When the field has visible errors, the field control must reference the error id with `aria-errormessage`.                                                                          | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.2              | FieldControl            | Current       |
| REQ-010 | MUST   | When the field is not invalid, the field control must not set `aria-errormessage` for a hidden or inactive error message.                                                           | WAI-ARIA 1.2 `aria-errormessage`; WCAG 2.2 SC 4.1.2                                 | FieldControl            | Current       |
| REQ-011 | SHOULD | When an error message appears after user interaction, `ErrorMessage` should expose `role="alert"` so assistive technologies can announce the message without moving focus.          | WAI-ARIA 1.2 `alert`; WCAG 2.2 SC 3.3.1; WCAG 2.2 SC 4.1.3                          | ErrorMessage            | Current       |
| REQ-012 | MUST   | `FieldControl` render props must allow consumers to render native form controls that preserve consumer-provided attributes and browser constraint validation behaviour.             | HTML Standard form control infrastructure; HTML Standard constraint validation      | FieldControl            | Current       |
| REQ-014 | SHOULD | When `FieldRoot` does not receive `activeErrors`, the field control should derive active error keys from the browser constraint validation API.                                     | HTML Standard constraint validation; WAI-ARIA 1.2 `aria-invalid`; WCAG 2.2 SC 3.3.1 | FieldControl            | Current       |
| REQ-015 | SHOULD | When detailed supporting content is supported, the field control should reference that content with `aria-details`.                                                                 | WAI-ARIA 1.2 `aria-details`; WCAG 2.2 SC 1.3.1                                      | FieldControl            | Potential     |
| REQ-016 | MUST   | When `FieldRoot` receives `isRequired`, `FieldControl` render props must expose `aria-required="true"`.                                                                             | WAI-ARIA 1.2 `aria-required`; WCAG 2.2 SC 3.3.2; WCAG 2.2 SC 4.1.2                  | FieldControl            | Current       |
| REQ-017 | MUST   | When `FieldRoot` receives `isReadOnly`, `FieldControl` render props must expose `aria-readonly="true"`.                                                                             | WAI-ARIA 1.2 `aria-readonly`; WCAG 2.2 SC 4.1.2                                     | FieldControl            | Current       |
| REQ-031 | MUST   | When `FieldRoot` receives `isLoading`, the field root and control must expose busy semantics with `aria-busy="true"`, and the control must expose disabled semantics while loading. | WAI-ARIA 1.2 `aria-busy`; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2           | FieldRoot, FieldControl | Current       |

## Product Requirements

| ID      | Requirement                                                                                                                                                                                                                             | Surfaces                             | Applicability |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------- |
| PRD-001 | Export `FieldRoot`, `FieldProvider`, `FieldControl`, `Label`, `Description`, and `ErrorMessage` from the field package entry point.                                                                                                     |                                      | Current       |
| PRD-002 | `FieldRoot` must accept `label`, `description`, and `errorMap` props as described in the API contract.                                                                                                                                  | FieldRoot                            | Current       |
| PRD-003 | `Label` and `Description` must render local children when supplied, otherwise render the corresponding content from the closest ancestor `FieldRoot` or `FieldProvider`; `ErrorMessage` must render visible error content from context. | Label, Description, ErrorMessage     | Current       |
| PRD-004 | `FieldRoot` must accept a `name` prop as the minimum field identity input for automatic relationship wiring.                                                                                                                            | FieldRoot                            | Current       |
| PRD-005 | Generated field ids must be consistent between server render and client hydration.                                                                                                                                                      | FieldRoot                            | Current       |
| PRD-006 | `FieldRoot` must accept `activeErrors` so external form state can provide the current error keys.                                                                                                                                       | FieldRoot                            | Current       |
| PRD-007 | `FieldRoot` must accept `errorPolicy` with the argument and return shapes described in the API contract.                                                                                                                                | FieldRoot                            | Current       |
| PRD-008 | `errorPolicy` must receive the event that caused validation state to be evaluated.                                                                                                                                                      | FieldRoot                            | Current       |
| PRD-009 | `errorPolicy` must receive `isValid` and `isErrorVisible` values for the current evaluation.                                                                                                                                            | FieldRoot                            | Current       |
| PRD-010 | `errorPolicy` must receive field event history through `field.wasBlurred`, `field.wasChanged`, `field.wasTouched`, and `field.wasErrored`.                                                                                              | FieldRoot                            | Current       |
| PRD-011 | `errorPolicy` must receive form event history through `form.wasSubmitted`.                                                                                                                                                              | FieldRoot                            | Current       |
| PRD-012 | `ErrorMessage` must accept an optional `renderChildren` prop for each visible error with the message content, CSS module class name, and error key.                                                                                     | ErrorMessage                         | Current       |
| PRD-013 | `FieldRoot`, `Description`, and `ErrorMessage` must support root substitution through `as` without changing relationship wiring.                                                                                                        | FieldRoot, Description, ErrorMessage | Current       |
| PRD-014 | `FieldControl` must support controls made of grouped native inputs, where each input reports validity as described in [Validity Reporting](#validity-reporting).                                                                        | FieldControl                         | Current       |
| PRD-015 | `FieldRoot` must accept `isRequired` and `isReadOnly` as field-level state inputs for label and field-control state hooks.                                                                                                              | Label, FieldControl                  | Current       |
| PRD-016 | When `FieldRoot` receives `isRequired`, `Label` must expose a `data-required` state hook.                                                                                                                                               | Label                                | Current       |
| PRD-017 | When `FieldRoot` receives `isReadOnly`, `Label` must expose a `data-readonly` state hook.                                                                                                                                               | Label                                | Current       |
| PRD-018 | Field elements must provide minimal default styles for foreground, spacing, required, readonly, and invalid states.                                                                                                                     |                                      | Current       |
| PRD-019 | `FieldRoot` must accept `isLoading` as field-level state for root busy semantics, label state hooks, and field-control busy and disabled semantics.                                                                                     | FieldRoot, Label, FieldControl       | Current       |
| PRD-020 | `FieldProvider` must support advanced composition by preserving the same field context, generated ids, and relationship wiring used by `FieldRoot`.                                                                                     | FieldProvider                        | Current       |
| PRD-021 | `FieldRoot` renders `useFieldRoot`'s props on its root inside a `FieldProvider`, so the hook carries the `FieldRoot` root contract.                                                                                                     | useFieldRoot                         | Current       |
| PRD-022 | `Label` renders `useLabel`'s props on a `label`, so the hook carries the `Label` contract.                                                                                                                                              | useLabel                             | Current       |
| PRD-023 | `FieldControl` passes `useFieldControl`'s result to its children, so the hook carries the `FieldControl` contract.                                                                                                                      | useFieldControl                      | Current       |
| PRD-024 | `Description` renders `useDescription`'s props on its root, so the hook carries the `Description` contract.                                                                                                                             | useDescription                       | Current       |
| PRD-025 | `ErrorMessage` renders `useErrorMessage`'s root props and items, so the hook carries the `ErrorMessage` contract.                                                                                                                       | useErrorMessage                      | Current       |
| PRD-026 | When a custom root calls a validity handler without a validity, `FieldControl` must record the field history event and leave the active error keys unchanged.                                                                           | FieldControl                         | Current       |
| PRD-027 | When a custom root passes a validity to a validity handler, `FieldControl` must replace any earlier reported validity with it, because it describes the whole control.                                                                  | FieldControl                         | Current       |

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
}

type ControlElement =
  | HTMLDivElement
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

// Value-control packages narrow TElement to their native element.
type ValidityHandlerProps<TElement extends Element = ControlElement> = {
  onBlur(
    event: React.FocusEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onChange(
    event: React.ChangeEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onFocus(
    event: React.FocusEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onInput(
    event: React.SyntheticEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onInvalid(
    event: React.SyntheticEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
}

type ValidityReporterProps<TElement extends Element = ControlElement> =
  ValidityHandlerProps<TElement> & {
    ref: React.RefCallback<TElement>
  }

type FieldControlRenderArgs = {
  fieldControlProps: FieldControlRenderProps
  validityHandlerProps: ValidityReporterProps
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
- `FieldControl` render props expose `validityHandlerProps` next to `fieldControlProps`. A single control spreads both on one element. A grouped control spreads `fieldControlProps` on its container and `validityHandlerProps` on each native input.
- Validity handlers take an optional second argument, a `ValidityState`-compatible object, so custom roots report through the same handlers native controls use. Native controls leave it out, and the field reads the element's own `ValidityState`.
- `validityHandlerProps` also carries a `ref`, so the field can drop the report of an input that unmounts. An element that also takes a consumer ref merges the two with `mergeRefs` from `@maratus-lib/props`.
- `field.wasBlurred`, `field.wasChanged`, and `field.wasTouched` are field-level event history flags, not value history flags.
- `field.wasErrored` records whether the field has previously shown an error.
- `form.wasSubmitted` is form-level event history when a form context exists, and otherwise defaults to `false`.
- The default policy hides errors while valid, shows errors for validation events, keeps errors visible after the field has previously shown one, and shows errors after an invalid blurred field.

### Validity Reporting

Each reporting input sends these browser events to the field. For each event, the field reads the `ValidityState` of the input the event fired at, and its true flags become that input's error keys. The field's error keys are the union of the current `ValidityState` error flags of each connected input that has reported. An event from an element without a `ValidityState`, such as a custom widget root, records its field history event and leaves the error keys unchanged. A validity passed as a handler's second argument describes the whole control, so the latest one replaces any earlier reported validity.

| Browser event | Fired at the input when (HTML Standard)                                                                     | Field history event (PRD-010) |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `focus`       | the input gains focus (focus update steps)                                                                  | `wasTouched`                  |
| `blur`        | the input loses focus (focus update steps)                                                                  | `wasBlurred`, `wasTouched`    |
| `input`       | the user changes its value or checkedness (common input element events)                                     | `wasChanged`, `wasTouched`    |
| `change`      | the user commits that change (common input element events)                                                  | `wasChanged`, `wasTouched`    |
| `invalid`     | constraint validation finds the input invalid: on form submission, `checkValidity()`, or `reportValidity()` | `wasTouched`                  |

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
