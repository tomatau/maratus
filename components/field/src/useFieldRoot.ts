import type { UseFieldRootOptions, UseFieldRootResult } from './Field.types'
import clsx from 'clsx'
import styles from './Field.module.css'

export function useFieldRoot(options: UseFieldRootOptions): UseFieldRootResult {
  const {
    'aria-busy': ariaBusy,
    className,
    isLoading = false,
    ...rootProps
  } = options

  return {
    fieldRootProps: {
      ...rootProps,
      'aria-busy': ariaBusy ?? (isLoading ? true : undefined),
      className: clsx(styles.field, className),
      'data-loading': isLoading ? '' : undefined,
    },
  }
}
