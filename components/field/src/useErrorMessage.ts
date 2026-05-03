import type {
  ErrorMessageItemProps,
  FieldErrorKey,
  UseErrorMessageOptions,
  UseErrorMessageResult,
} from './Field.types'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useErrorMessage(
  options: UseErrorMessageOptions,
): UseErrorMessageResult {
  const { className, id, ...errorMessageRootProps } = options
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
      ...errorMessageRootProps,
      className: clsx(styles.errorMessageRoot, className),
      id: id ?? field.errorId,
      role: field.visibleErrors.length > 0 ? 'alert' : undefined,
    },
    items,
  }
}
