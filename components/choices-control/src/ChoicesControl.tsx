import type {
  ChoicesControlMode,
  ChoicesControlProps,
} from './ChoicesControl.types'
import { useChoicesControl } from './useChoicesControl'

export function ChoicesControl<TMode extends ChoicesControlMode = 'checkboxes'>(
  props: ChoicesControlProps<TMode>,
) {
  return props.children(useChoicesControl<TMode>(props))
}
