import type { HTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './separator.module.css'

export type UseSeparatorProps = HTMLAttributes<HTMLHRElement> & {
  isDecorative?: boolean
  isNative?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export type UseSeparatorResult = {
  separatorProps: HTMLAttributes<HTMLDivElement | HTMLHRElement>
}

export function useSeparator(props: UseSeparatorProps): UseSeparatorResult {
  const {
    className,
    isDecorative,
    orientation = 'horizontal',
    isNative = true,
    ...rest
  } = props
  const isVertical = orientation === 'vertical'

  const semanticProps = isNative
    ? {}
    : {
        role: 'separator' as const,
        ...(isVertical ? { 'aria-orientation': 'vertical' as const } : {}),
      }

  return {
    separatorProps: {
      ...rest,
      'aria-hidden': isDecorative ? true : rest['aria-hidden'],
      className: clsx(
        styles.separator,
        isVertical && styles.vertical,
        className,
      ),
      ...semanticProps,
    },
  }
}
