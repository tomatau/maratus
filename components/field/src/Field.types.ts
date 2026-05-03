import type {
  AriaAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactEventHandler,
  ReactNode,
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
  isReadOnly?: boolean
  isRequired?: boolean
  label: ReactNode
  name: string
}

export type UseFieldRootOptions = Pick<
  HTMLAttributes<HTMLDivElement>,
  'className'
>

export type UseFieldRootResult = {
  fieldRootProps: HTMLAttributes<HTMLDivElement>
}

export type UseLabelOptions = Pick<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'htmlFor' | 'id'
>

export type LabelRootProps = LabelHTMLAttributes<HTMLLabelElement> & {
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

export type ControlRenderProps = {
  'aria-describedby'?: AriaAttributes['aria-describedby']
  'aria-errormessage'?: AriaAttributes['aria-errormessage']
  'aria-invalid'?: AriaAttributes['aria-invalid']
  'aria-readonly'?: AriaAttributes['aria-readonly']
  'aria-required'?: AriaAttributes['aria-required']
  id: string
  name?: string
  onBlur?: FocusEventHandler<ControlElement>
  onChange?: ChangeEventHandler<ControlElement>
  onFocus?: FocusEventHandler<ControlElement>
  onInput?: ReactEventHandler<ControlElement>
  onInvalid?: ReactEventHandler<ControlElement>
  readOnly?: boolean
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

export type UseControlOptions = {
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

export type UseDescriptionOptions = {
  children?: ReactNode
  id?: string
}

export type UseDescriptionResult = {
  descriptionProps: HTMLAttributes<HTMLDivElement>
}

export type UseErrorMessageOptions = {
  id?: string
}

export type ErrorMessageItemProps = {
  children: ReactNode
  className: string
  errorKey: FieldErrorKey
  key: FieldErrorKey
}

export type UseErrorMessageResult = {
  errorMessageProps: HTMLAttributes<HTMLDivElement>
  items: readonly ErrorMessageItemProps[]
}
