import type {
  BooleanControlMode,
  BooleanControlProps,
} from './BooleanControl.types'
import { useBooleanControl } from './useBooleanControl'

export function BooleanControl<TMode extends BooleanControlMode = 'native'>(
  props: BooleanControlProps<TMode>,
) {
  return props.children(useBooleanControl<TMode>(props))
}
