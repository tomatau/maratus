import type {
  FieldContextValue,
  UseFieldControlOptions,
  UseFieldControlResult,
  ValidityHandlerProps,
  WithValidity,
} from './Field.types'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useFieldControl(
  options: UseFieldControlOptions = {},
): UseFieldControlResult {
  const {
    className,
    onBlur,
    onChange,
    onFocus,
    onInput,
    onInvalid,
    ...fieldControlRootProps
  } = options
  const field = useFieldContext('FieldControl')

  return {
    fieldControlProps: {
      ...fieldControlRootProps,
      'aria-busy': field.isLoading ? true : undefined,
      'aria-describedby': field.description ? field.descriptionId : undefined,
      'aria-disabled': field.isLoading ? true : undefined,
      'aria-errormessage':
        field.visibleErrors.length > 0 ? field.errorId : undefined,
      'aria-invalid': field.visibleErrors.length > 0 ? true : undefined,
      className: clsx(styles.fieldControl, className),
      'data-loading': field.isLoading ? '' : undefined,
      id: field.controlId,
      ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
      ...(field.isRequired ? { 'aria-required': true } : {}),
    },
    validityHandlerProps: composeValidityHandlerProps(
      { onBlur, onChange, onFocus, onInput, onInvalid },
      field.updateValidityState,
    ),
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

function composeValidityHandlerProps(
  userHandlers: Partial<ValidityHandlerProps>,
  updateValidityState: FieldContextValue['updateValidityState'],
): ValidityHandlerProps {
  return {
    onBlur: (event) => {
      userHandlers.onBlur?.(event)
      updateValidityState('blur', getValidityControl(event))
    },
    onChange: (event) => {
      userHandlers.onChange?.(event)
      updateValidityState('change', getValidityControl(event))
    },
    onFocus: (event) => {
      userHandlers.onFocus?.(event)
      updateValidityState('focus', getValidityControl(event))
    },
    onInput: (event) => {
      userHandlers.onInput?.(event)
      updateValidityState('input', getValidityControl(event))
    },
    onInvalid: (event) => {
      userHandlers.onInvalid?.(event)
      updateValidityState('invalid', getValidityControl(event))
    },
  }
}

function getValidityControl(event: { currentTarget: EventTarget }) {
  return event.currentTarget as EventTarget & { validity: ValidityState }
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
