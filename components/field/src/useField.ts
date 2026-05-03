import type { FieldErrorKey } from './FieldContext'
import type {
  AriaAttributes,
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactEventHandler,
  ReactNode,
} from 'react'
import clsx from 'clsx'
import { useFieldContext } from './FieldContext'
import styles from './Field.module.css'

export type UseFieldRootOptions = Pick<
  HTMLAttributes<HTMLDivElement>,
  'className'
>

export type UseFieldRootResult = {
  fieldRootProps: HTMLAttributes<HTMLDivElement>
}

export function useFieldRoot(options: UseFieldRootOptions): UseFieldRootResult {
  const { className } = options

  return {
    fieldRootProps: {
      className: clsx(styles.field, className),
    },
  }
}

export type UseLabelOptions = Pick<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'htmlFor' | 'id'
>

type LabelRootProps = LabelHTMLAttributes<HTMLLabelElement> & {
  'data-readonly'?: ''
  'data-required'?: ''
}

export type UseLabelResult = {
  labelProps: LabelRootProps
}

export function useLabel(options: UseLabelOptions): UseLabelResult {
  const { children, htmlFor, id } = options
  const field = useFieldContext('Label')

  return {
    labelProps: {
      children: children ?? field.label,
      'data-readonly': field.isReadOnly ? '' : undefined,
      'data-required': field.isRequired ? '' : undefined,
      htmlFor: htmlFor ?? field.controlId,
      id: id ?? field.labelId,
    },
  }
}

type ControlElement =
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

export function useControl(options: UseControlOptions = {}): UseControlResult {
  const { role } = options
  const field = useFieldContext('Control')
  const relationshipProps = {
    'aria-describedby': field.description ? field.descriptionId : undefined,
    'aria-errormessage':
      field.visibleErrors.length > 0 ? field.errorId : undefined,
    'aria-invalid': field.visibleErrors.length > 0 ? true : undefined,
    id: field.controlId,
  } satisfies Pick<
    ControlRenderProps,
    'aria-describedby' | 'aria-errormessage' | 'aria-invalid' | 'id'
  >
  const validityHandlerProps = getValidityHandlerProps(
    field.evaluateNativeValidity,
  )

  if (role) {
    return {
      controlProps: {
        ...relationshipProps,
        ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
        ...(field.isRequired ? { 'aria-required': true } : {}),
        ...validityHandlerProps,
        role,
      },
      withValidity,
    }
  }

  return {
    controlProps: {
      ...relationshipProps,
      name: field.name,
      ...validityHandlerProps,
      ...(field.isReadOnly ? { readOnly: true } : {}),
      ...(field.isRequired ? { required: true } : {}),
    },
    withValidity,
  }
}

export type WithValidity = <TEvent extends { currentTarget: EventTarget }>(
  event: TEvent,
  validity: Partial<ValidityState>,
) => TEvent & {
  currentTarget: TEvent['currentTarget'] & {
    validity: ValidityState
  }
}

const withValidity: WithValidity = (event, validity) => {
  const currentTarget = Object.create(
    Object.getPrototypeOf(event.currentTarget),
  ) as typeof event.currentTarget & { validity: ValidityState }

  Object.assign(currentTarget, event.currentTarget, {
    validity: createValidityState(validity),
  })

  return {
    ...event,
    currentTarget,
  }
}

function getValidityHandlerProps(
  evaluateNativeValidity: ReturnType<
    typeof useFieldContext
  >['evaluateNativeValidity'],
): Pick<
  ControlRenderProps,
  'onBlur' | 'onChange' | 'onFocus' | 'onInput' | 'onInvalid'
> {
  return {
    onBlur: (event) =>
      evaluateNativeValidity('blur', getValidityControl(event)),
    onChange: (event) =>
      evaluateNativeValidity('change', getValidityControl(event)),
    onFocus: (event) =>
      evaluateNativeValidity('focus', getValidityControl(event)),
    onInput: (event) =>
      evaluateNativeValidity('input', getValidityControl(event)),
    onInvalid: (event) =>
      evaluateNativeValidity('invalid', getValidityControl(event)),
  }
}

function getValidityControl(event: { currentTarget: ControlElement }) {
  return event.currentTarget as ControlElement & { validity: ValidityState }
}

const validityStateKeys = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
] as const satisfies readonly (keyof Omit<ValidityState, 'valid'>)[]

function createValidityState(validity: Partial<ValidityState>): ValidityState {
  const errors = Object.fromEntries(
    validityStateKeys.map((key) => [key, validity[key] ?? false]),
  ) as Record<(typeof validityStateKeys)[number], boolean>

  return {
    ...errors,
    valid:
      validity.valid ?? validityStateKeys.every((key) => errors[key] === false),
  }
}

export type UseDescriptionOptions = {
  children?: ReactNode
  id?: string
}

export type UseDescriptionResult = {
  descriptionProps: HTMLAttributes<HTMLDivElement>
}

export function useDescription(
  options: UseDescriptionOptions,
): UseDescriptionResult {
  const { children, id } = options
  const field = useFieldContext('Description')

  return {
    descriptionProps: {
      children: children ?? field.description,
      id: id ?? field.descriptionId,
    },
  }
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

export function useErrorMessage(
  options: UseErrorMessageOptions,
): UseErrorMessageResult {
  const { id } = options
  const field = useFieldContext('ErrorMessage')
  const items = field.visibleErrors
    .map((errorKey) => [errorKey, field.errorMap?.get(errorKey)] as const)
    .filter(
      (entry): entry is readonly [FieldErrorKey, ReactNode] => entry[1] != null,
    )
    .map(
      ([errorKey, message]): ErrorMessageItemProps => ({
        children: message,
        className: styles.errorMessage,
        errorKey,
        key: errorKey,
      }),
    )

  return {
    errorMessageProps: {
      id: id ?? field.errorId,
      role: field.visibleErrors.length > 0 ? 'alert' : undefined,
    },
    items,
  }
}
