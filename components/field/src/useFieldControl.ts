import type {
  FieldContextValue,
  UseFieldControlOptions,
  UseFieldControlResult,
  ValidityHandlerProps,
} from './Field.types'
import { mergeRefs } from '@maratus-lib/props'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import { getValidityReport } from './validityReport'
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
    ref,
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
      ...(ref ? { ref: mergeRefs(ref) } : {}),
      ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
      ...(field.isRequired ? { 'aria-required': true } : {}),
    },
    validityHandlerProps: {
      ...composeValidityHandlerProps(
        { onBlur, onChange, onFocus, onInput, onInvalid },
        field.updateValidityState,
      ),
      ref: field.validityReporterRef,
    },
  }
}

function composeValidityHandlerProps(
  userHandlers: Partial<ValidityHandlerProps>,
  updateValidityState: FieldContextValue['updateValidityState'],
): ValidityHandlerProps {
  return {
    onBlur: (event, validity) => {
      userHandlers.onBlur?.(event)
      updateValidityState('blur', getValidityReport(event, validity))
    },
    onChange: (event, validity) => {
      userHandlers.onChange?.(event)
      updateValidityState('change', getValidityReport(event, validity))
    },
    onFocus: (event, validity) => {
      userHandlers.onFocus?.(event)
      updateValidityState('focus', getValidityReport(event, validity))
    },
    onInput: (event, validity) => {
      userHandlers.onInput?.(event)
      updateValidityState('input', getValidityReport(event, validity))
    },
    onInvalid: (event, validity) => {
      userHandlers.onInvalid?.(event)
      updateValidityState('invalid', getValidityReport(event, validity))
    },
  }
}
