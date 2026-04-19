import type { ElementType, HTMLAttributes } from 'react'
import { useSeparator } from './useSeparator'

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  as?: ElementType
  isDecorative?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function Separator(props: SeparatorProps) {
  const { as, orientation = 'horizontal' } = props
  const defaultTag = orientation === 'vertical' ? 'div' : 'hr'
  const Root = as ?? defaultTag
  const { separatorProps } = useSeparator({
    ...props,
    isNative: Root === 'hr',
  })

  return <Root {...separatorProps} />
}
