import type { UseFieldRootOptions, UseFieldRootResult } from './Field.types'
import clsx from 'clsx'
import styles from './Field.module.css'

export function useFieldRoot(options: UseFieldRootOptions): UseFieldRootResult {
  const { className } = options

  return {
    fieldRootProps: {
      className: clsx(styles.field, className),
    },
  }
}
