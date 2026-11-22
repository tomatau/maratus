import type { ComponentPropsWithRef, HTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './Separator.module.css'

// `native` renders the native <hr>; `custom` adds the
// semantics a non-native root needs.
export type SeparatorMode = 'custom' | 'native'

export type UseSeparatorProps = ComponentPropsWithRef<'hr'> & {
  isDecorative?: boolean
  mode?: SeparatorMode
  orientation?: 'horizontal' | 'vertical'
}

export type UseSeparatorResult = {
  separatorProps: HTMLAttributes<HTMLDivElement | HTMLHRElement> &
    Pick<ComponentPropsWithRef<'hr'>, 'ref'>
}

export function useSeparator(props: UseSeparatorProps): UseSeparatorResult {
  const {
    className,
    isDecorative,
    orientation = 'horizontal',
    mode = 'native',
    ...rest
  } = props
  const isNative = mode === 'native'
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
