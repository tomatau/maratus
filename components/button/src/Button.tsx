import type { ButtonBaseProps } from './useButton'
import { ElementType } from 'react'
import { useButton } from './useButton'

export type ButtonProps = ButtonBaseProps & {
  as?: ElementType
}

export function Button(props: ButtonProps) {
  const { as: Root = 'button', ...hookProps } = props
  const { buttonProps } = useButton({
    ...hookProps,
    isNative: Root === 'button',
  })

  return <Root {...buttonProps} />
}
