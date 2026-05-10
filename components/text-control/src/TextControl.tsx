import type { TextControlProps } from './TextControl.types'
import { useTextControl } from './useTextControl'

export function TextControl(props: TextControlProps) {
  const { children, ...hookProps } = props
  const control = useTextControl(hookProps)

  return children(control)
}
