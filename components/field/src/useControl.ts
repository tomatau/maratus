import type {
  ControlElement,
  ControlRenderProps,
  FieldContextValue,
  UseControlOptions,
  UseControlResult,
  WithValidity,
} from './Field.types'
import clsx from 'clsx'
import { useFieldContext as useRequiredFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useControl(options: UseControlOptions = {}): UseControlResult {
  const { className, role, ...controlRootProps } = options
  const field = useRequiredFieldContext('Control')
  const relationshipProps = {
    'aria-busy': field.isLoading ? true : undefined,
    'aria-describedby': field.description ? field.descriptionId : undefined,
    'aria-disabled': field.isLoading ? true : undefined,
    'aria-errormessage':
      field.visibleErrors.length > 0 ? field.errorId : undefined,
    'aria-invalid': field.visibleErrors.length > 0 ? true : undefined,
    className: clsx(styles.control, className),
    'data-loading': field.isLoading ? '' : undefined,
    id: field.controlId,
  } satisfies Pick<
    ControlRenderProps,
    | 'aria-busy'
    | 'aria-describedby'
    | 'aria-disabled'
    | 'aria-errormessage'
    | 'aria-invalid'
    | 'className'
    | 'data-loading'
    | 'id'
  >
  const validityHandlerProps = getValidityHandlerProps(
    field.evaluateNativeValidity,
  )

  if (role) {
    return {
      controlProps: {
        ...controlRootProps,
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
      ...controlRootProps,
      ...relationshipProps,
      ...(field.isLoading ? { disabled: true } : {}),
      name: field.name,
      ...validityHandlerProps,
      ...(field.isReadOnly ? { readOnly: true } : {}),
      ...(field.isRequired ? { required: true } : {}),
    },
    withValidity,
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
  evaluateNativeValidity: FieldContextValue['evaluateNativeValidity'],
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
