import type { UseLabelOptions, UseLabelResult } from './Field.types'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useLabel(options: UseLabelOptions): UseLabelResult {
  const { children, className, htmlFor, id, ...labelRootProps } = options
  const field = useFieldContext('Label')

  return {
    labelProps: {
      ...labelRootProps,
      children: children ?? field.label,
      className: clsx(styles.label, className),
      'data-readonly': field.isReadOnly ? '' : undefined,
      'data-required': field.isRequired ? '' : undefined,
      htmlFor: htmlFor ?? field.controlId,
      id: id ?? field.labelId,
    },
  }
}
