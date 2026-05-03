import type { UseDescriptionOptions, UseDescriptionResult } from './Field.types'
import clsx from 'clsx'
import { useFieldContext } from './useFieldContext'
import styles from './Field.module.css'

export function useDescription(
  options: UseDescriptionOptions,
): UseDescriptionResult {
  const { children, className, id, ...descriptionRootProps } = options
  const field = useFieldContext('Description')

  return {
    descriptionProps: {
      ...descriptionRootProps,
      children: children ?? field.description,
      className: clsx(styles.description, className),
      id: id ?? field.descriptionId,
    },
  }
}
