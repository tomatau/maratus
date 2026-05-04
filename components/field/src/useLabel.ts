import type { UseLabelOptions, UseLabelResult } from './Field.types'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useLabel(options: UseLabelOptions): UseLabelResult {
  const { children, className, ...labelRootProps } = options
  const field = useFieldContext('Label')

  return {
    labelProps: {
      ...labelRootProps,
      children: children ?? field.label,
      className: clsx(styles.label, className),
      'data-loading': field.isLoading ? '' : undefined,
      'data-readonly': field.isReadOnly ? '' : undefined,
      'data-required': field.isRequired ? '' : undefined,
      htmlFor: field.controlId,
      id: field.labelId,
    },
  }
}
