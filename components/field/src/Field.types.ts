import type {
  AriaAttributes,
  ChangeEvent,
  ComponentPropsWithRef,
  FocusEvent,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefCallback,
  SyntheticEvent,
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
  updateValidityState(
    event: FieldErrorPolicyArgs['event'],
    report: ValidityReport,
  ): void
  isLoading: boolean
  isReadOnly: boolean
  isRequired: boolean
  label: ReactNode
  labelId: string
  name: string
  validityReporterRef: RefCallback<ControlElement>
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

// Field owns label relationship wiring so consumers cannot override the
// generated label id or control association.
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

type FieldControlElementProps = Omit<
  HTMLAttributes<ControlElement>,
  'onBlur' | 'onChange' | 'onFocus' | 'onInput' | 'onInvalid' | 'role'
>

export type FieldControlRenderProps = FieldControlElementProps & {
  'aria-busy'?: AriaAttributes['aria-busy']
  'aria-describedby'?: AriaAttributes['aria-describedby']
  'aria-disabled'?: AriaAttributes['aria-disabled']
  'aria-errormessage'?: AriaAttributes['aria-errormessage']
  'aria-invalid'?: AriaAttributes['aria-invalid']
  'aria-readonly'?: AriaAttributes['aria-readonly']
  'aria-required'?: AriaAttributes['aria-required']
  'data-loading'?: ''
  id: string
  ref?: RefCallback<ControlElement>
}

// A custom root passes the control's validity as the second argument. Native
// controls leave it out, so the field reads the element's own ValidityState.
// Method signatures keep the handlers assignable to React's event props.
export type ValidityHandlerProps<TElement extends Element = ControlElement> = {
  onBlur(event: FocusEvent<TElement>, validity?: Partial<ValidityState>): void
  onChange(
    event: ChangeEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onFocus(event: FocusEvent<TElement>, validity?: Partial<ValidityState>): void
  onInput(
    event: SyntheticEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
  onInvalid(
    event: SyntheticEvent<TElement>,
    validity?: Partial<ValidityState>,
  ): void
}

// Spread on each reporting input. The ref lets the field drop a removed
// input's report; merge it with a consumer ref through mergeRefs.
export type ValidityReporterProps<TElement extends Element = ControlElement> =
  ValidityHandlerProps<TElement> & {
    ref: RefCallback<TElement>
  }

export type FieldControlRenderArgs = {
  fieldControlProps: FieldControlRenderProps
  validityHandlerProps: ValidityReporterProps
}

export type UseFieldControlOptions<TElement extends Element = ControlElement> =
  Omit<
    FieldControlRenderProps,
    | 'aria-describedby'
    | 'aria-busy'
    | 'aria-disabled'
    | 'aria-errormessage'
    | 'aria-invalid'
    | 'aria-readonly'
    | 'aria-required'
    | 'children'
    | 'data-loading'
    | 'id'
    | 'ref'
  > &
    Partial<ValidityHandlerProps<TElement>> & {
      ref?: Ref<TElement>
    }

export type UseFieldControlResult = FieldControlRenderArgs

export type ValidityReport = {
  reporter: EventTarget | symbol
  validity: ValidityState | null
}

// Field owns the description id because FieldControl
// uses it for aria-describedby.
export type UseDescriptionOptions = Omit<ComponentPropsWithRef<'div'>, 'id'>

export type UseDescriptionResult = {
  descriptionProps: ComponentPropsWithRef<'div'>
}

// Field owns the error id because FieldControl uses it
// for aria-errormessage when errors are visible.
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
