import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './separator.module.css'

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  isDecorative?: boolean
}

export function Separator(props: SeparatorProps) {
  const { className, isDecorative, ...rest } = props
  const ariaHidden = isDecorative ? true : rest['aria-hidden']

  return (
    <hr
      {...rest}
      aria-hidden={ariaHidden}
      className={clsx(styles.separator, className)}
    />
  )
}
