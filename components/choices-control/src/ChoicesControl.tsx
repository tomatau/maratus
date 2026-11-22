import type {
  ChoicesControlMode,
  ChoicesControlProps,
} from './ChoicesControl.types'
import { useChoicesControl } from './useChoicesControl'

export function ChoicesControl<TMode extends ChoicesControlMode>(
  props: ChoicesControlProps<TMode>,
) {
  const { children, ...hookProps } = props
  const control = useChoicesControl<TMode>(hookProps)

  return children(control)
}
