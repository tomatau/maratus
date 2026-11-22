import type {
  FieldContextValue,
  UseFieldControlOptions,
  UseFieldControlResult,
  ValidityHandlerProps,
  ValidityReport,
  WithValidity,
} from './Field.types'
import clsx from 'clsx'
import { validityErrorKeys } from './fieldValidity'
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

const withValiditySources = new WeakMap<EventTarget, EventTarget>()

const withValidity: WithValidity = (event, validity) => {
  const currentTarget = Object.create(
    Object.getPrototypeOf(event.currentTarget),
  ) as typeof event.currentTarget & { validity: ValidityState }

  Object.assign(currentTarget, event.currentTarget, {
    validity: createValidityState(validity),
  })
  withValiditySources.set(currentTarget, event.currentTarget)

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
      updateValidityState('blur', getValidityReport(event))
    },
    onChange: (event) => {
      userHandlers.onChange?.(event)
      updateValidityState('change', getValidityReport(event))
    },
    onFocus: (event) => {
      userHandlers.onFocus?.(event)
      updateValidityState('focus', getValidityReport(event))
    },
    onInput: (event) => {
      userHandlers.onInput?.(event)
      updateValidityState('input', getValidityReport(event))
    },
    onInvalid: (event) => {
      userHandlers.onInvalid?.(event)
      updateValidityState('invalid', getValidityReport(event))
    },
  }
}

function getValidityReport(event: {
  currentTarget: EventTarget
}): ValidityReport {
  const control = event.currentTarget as EventTarget & {
    validity: ValidityState
  }

  return {
    reporter: withValiditySources.get(control) ?? control,
    validity: control.validity,
  }
}

function createValidityState(validity: Partial<ValidityState>): ValidityState {
  const errors = Object.fromEntries(
    validityErrorKeys.map((key) => [key, validity[key] ?? false]),
  ) as Record<(typeof validityErrorKeys)[number], boolean>

  return {
    ...errors,
    valid:
      validity.valid ?? validityErrorKeys.every((key) => errors[key] === false),
  }
}
