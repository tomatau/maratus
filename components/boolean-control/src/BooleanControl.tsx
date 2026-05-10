import type { BooleanControlProps } from './BooleanControl.types'
import { useBooleanControl } from './useBooleanControl'

export function BooleanControl(props: BooleanControlProps) {
  const { children, ...hookProps } = props
  const control = useBooleanControl(hookProps)

  return children(control)
}
