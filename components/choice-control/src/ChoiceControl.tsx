import type {
  ChoiceControlMode,
  ChoiceControlProps,
} from './ChoiceControl.types'
import { useChoiceControl } from './useChoiceControl'

export function ChoiceControl<TMode extends ChoiceControlMode>(
  props: ChoiceControlProps<TMode>,
) {
  const { children, ...hookProps } = props
  const control = useChoiceControl<TMode>(hookProps)

  return children(control)
}
