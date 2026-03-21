import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './separator.module.css'

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  isDecorative?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function Separator(props: SeparatorProps) {
  const { className, isDecorative, orientation = 'horizontal', ...rest } = props
  const isVertical = orientation === 'vertical'

  const Tag = isVertical ? 'div' : 'hr'
  const ariaHidden = isDecorative ? true : rest['aria-hidden']
  const semanticProps = isVertical
    ? {
        'aria-orientation': 'vertical' as const,
        role: 'separator' as const,
      }
    : {}

  return (
    <Tag
      {...rest}
      aria-hidden={ariaHidden}
      {...semanticProps}
      className={clsx(styles.separator, className)}
    />
  )
}
