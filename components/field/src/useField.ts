import type { FieldErrorKey } from './FieldContext'
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import { createElement } from 'react'
import { useFieldContext } from './FieldContext'
import styles from './Field.module.css'

export type UseLabelOptions = Pick<
  LabelHTMLAttributes<HTMLLabelElement>,
  'children' | 'htmlFor' | 'id'
>

export function useLabel(options: UseLabelOptions) {
  const { children, htmlFor, id } = options
  const field = useFieldContext('Label')

  return {
    children: children ?? field.label,
    htmlFor: htmlFor ?? field.controlId,
    id: id ?? field.labelId,
  }
}

export type ControlRenderProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-errormessage'
  | 'aria-invalid'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'onInput'
  | 'onInvalid'
>

export function useControl(): ControlRenderProps {
  const field = useFieldContext('Control')

  return {
    'aria-describedby': field.description ? field.descriptionId : undefined,
    'aria-errormessage':
      field.visibleErrors.length > 0 ? field.errorId : undefined,
    'aria-invalid': field.visibleErrors.length > 0 ? true : undefined,
    id: field.controlId,
    name: field.name,
    onBlur: (event) =>
      field.evaluateNativeValidity('blur', event.currentTarget),
    onChange: (event) =>
      field.evaluateNativeValidity('change', event.currentTarget),
    onFocus: (event) =>
      field.evaluateNativeValidity('focus', event.currentTarget),
    onInput: (event) =>
      field.evaluateNativeValidity('input', event.currentTarget),
    onInvalid: (event) =>
      field.evaluateNativeValidity('invalid', event.currentTarget),
  }
}

export type UseDescriptionOptions = {
  children?: ReactNode
  id?: string
}

export function useDescription(options: UseDescriptionOptions) {
  const { children, id } = options
  const field = useFieldContext('Description')

  return {
    children: children ?? field.description,
    id: id ?? field.descriptionId,
  }
}

export type UseErrorMessageOptions = {
  children?: ReactNode
  id?: string
}

export function useErrorMessage(options: UseErrorMessageOptions) {
  const { children, id } = options
  const field = useFieldContext('ErrorMessage')
  const errorMessages = field.visibleErrors
    .map((errorKey) => [errorKey, field.errorMap?.get(errorKey)] as const)
    .filter(
      (entry): entry is readonly [FieldErrorKey, ReactNode] => entry[1] != null,
    )

  return {
    children:
      children ??
      errorMessages.map(([errorKey, message]) =>
        createElement(
          'p',
          {
            className: styles.errorMessage,
            key: errorKey,
          },
          message,
        ),
      ),
    id: id ?? field.errorId,
    role: field.visibleErrors.length > 0 ? 'alert' : undefined,
  }
}
