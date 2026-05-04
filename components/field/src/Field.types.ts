import type {
  AriaAttributes,
  ChangeEventHandler,
  ComponentPropsWithRef,
  FocusEventHandler,
  HTMLAttributes,
  ReactEventHandler,
  ReactNode,
  Ref,
} from 'react'

export type ValidityErrorKey = Exclude<keyof ValidityState, 'valid'>

export type FieldErrorKey = ValidityErrorKey | (string & {})

export type FieldErrorPolicyFieldState = {
  wasBlurred: boolean
  wasChanged: boolean
  wasTouched: boolean
  wasErrored: boolean
}

export type FieldErrorPolicyFormState = {
  wasSubmitted: boolean
}

export type FieldErrorPolicyArgs = {
  event: 'invalid' | 'blur' | 'focus' | 'input' | 'change'
  isValid: boolean
  isErrorVisible: boolean
  field: FieldErrorPolicyFieldState
  form: FieldErrorPolicyFormState
  activeErrors: ReadonlySet<FieldErrorKey>
}

export type FieldErrorPolicyResult = false | true | readonly FieldErrorKey[]

export type FieldErrorPolicy = (
  args: FieldErrorPolicyArgs,
) => FieldErrorPolicyResult

export type FieldContextValue = {
  activeErrors?: ReadonlySet<FieldErrorKey>
  controlId: string
  description: ReactNode
  descriptionId: string
  errorId: string
  errorMap?: ReadonlyMap<FieldErrorKey, ReactNode>
  evaluateNativeValidity(
    event: FieldErrorPolicyArgs['event'],
    control: { validity: ValidityState },
  ): void
  isLoading: boolean
  isReadOnly: boolean
  isRequired: boolean
  label: ReactNode
  labelId: string
  name: string
  visibleErrors: readonly FieldErrorKey[]
}

export type FieldProviderProps = {
  activeErrors?: ReadonlySet<FieldErrorKey>
  children: ReactNode
  controlId?: string
  description?: ReactNode
  errorMap?: ReadonlyMap<FieldErrorKey, ReactNode>
  errorPolicy?: FieldErrorPolicy
  isLoading?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  label: ReactNode
  name: string
}

export type UseFieldRootOptions = ComponentPropsWithRef<'div'> & {
  isLoading?: boolean
}

export type FieldRootRenderProps = ComponentPropsWithRef<'div'> & {
  'data-loading'?: ''
}

export type UseFieldRootResult = {
  fieldRootProps: FieldRootRenderProps
}

// GPRD-006, REQ-002 and REQ-004: Field owns label relationship wiring so
// consumers cannot override the generated label id or control association.
export type UseLabelOptions = Omit<
  ComponentPropsWithRef<'label'>,
  'htmlFor' | 'id'
>

export type LabelRootProps = ComponentPropsWithRef<'label'> & {
  'data-loading'?: ''
  'data-readonly'?: ''
  'data-required'?: ''
}

export type UseLabelResult = {
  labelProps: LabelRootProps
}

export type ControlElement =
  | HTMLDivElement
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

type ControlElementProps = Omit<
  HTMLAttributes<ControlElement>,
  'onBlur' | 'onChange' | 'onFocus' | 'onInput' | 'onInvalid'
>

export type ControlRenderProps = ControlElementProps & {
  'aria-busy'?: AriaAttributes['aria-busy']
  'aria-describedby'?: AriaAttributes['aria-describedby']
  'aria-disabled'?: AriaAttributes['aria-disabled']
  'aria-errormessage'?: AriaAttributes['aria-errormessage']
  'aria-invalid'?: AriaAttributes['aria-invalid']
  'aria-readonly'?: AriaAttributes['aria-readonly']
  'aria-required'?: AriaAttributes['aria-required']
  'data-loading'?: ''
  disabled?: boolean
  id: string
  name?: string
  onBlur?: FocusEventHandler<ControlElement>
  onChange?: ChangeEventHandler<ControlElement>
  onFocus?: FocusEventHandler<ControlElement>
  onInput?: ReactEventHandler<ControlElement>
  onInvalid?: ReactEventHandler<ControlElement>
  readOnly?: boolean
  ref?: Ref<any>
  required?: boolean
  role?: ControlRole
}

export type ControlRenderArgs = {
  controlProps: ControlRenderProps
  withValidity: WithValidity
}

export type ControlRole =
  | 'checkbox'
  | 'combobox'
  | 'listbox'
  | 'searchbox'
  | 'spinbutton'
  | 'textbox'

export type UseControlOptions = Omit<
  ControlRenderProps,
  | 'aria-describedby'
  | 'aria-busy'
  | 'aria-disabled'
  | 'aria-errormessage'
  | 'aria-invalid'
  | 'aria-readonly'
  | 'aria-required'
  | 'children'
  | 'data-loading'
  | 'disabled'
  | 'id'
  | 'name'
  | 'readOnly'
  | 'required'
  | 'role'
> & {
  role?: ControlRole
}

export type UseControlResult = {
  controlProps: ControlRenderProps
  withValidity: WithValidity
}

export type WithValidity = <TEvent extends { currentTarget: EventTarget }>(
  event: TEvent,
  validity: Partial<ValidityState>,
) => TEvent & {
  currentTarget: TEvent['currentTarget'] & {
    validity: ValidityState
  }
}

// GPRD-006 and REQ-005: Field owns the description id because Control uses it
// for aria-describedby.
export type UseDescriptionOptions = Omit<ComponentPropsWithRef<'div'>, 'id'>

export type UseDescriptionResult = {
  descriptionProps: ComponentPropsWithRef<'div'>
}

// GPRD-006 and REQ-007: Field owns the error id because Control uses it for
// aria-errormessage when errors are visible.
export type UseErrorMessageOptions = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'id'
>

export type ErrorMessageItemProps = {
  children: ReactNode
  className: string
  errorKey: FieldErrorKey
  key: FieldErrorKey
}

export type UseErrorMessageResult = {
  errorMessageProps: ComponentPropsWithRef<'div'>
  items: readonly ErrorMessageItemProps[]
}
