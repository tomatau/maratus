import type {
  BooleanControlRootProps,
  NativeBooleanControlInput,
  UseNativeBooleanControlResult,
} from './BooleanControl.types'
import { omitProps } from '@maratus-lib/props'

export function getNativeBooleanControl({
  checked,
  controlProps,
  field,
  isInteractionDisabled,
  role,
}: NativeBooleanControlInput): UseNativeBooleanControlResult {
  return {
    booleanControlProps: {
      // Native attributes carry these states, so their ARIA forms must not.
      ...omitProps(controlProps, [
        'aria-checked',
        'aria-disabled',
        'aria-required',
      ]),
      // Without checked, the browser keeps the state.
      ...(checked === undefined ? {} : { checked }),
      ...(isInteractionDisabled ? { disabled: true } : {}),
      name: field.name,
      ...(field.isReadOnly ? preventToggle(controlProps) : {}),
      ...(field.isRequired ? { required: true } : {}),
      // A native checkbox already has the checkbox role.
      ...(role === 'switch' ? { role } : {}),
      type: 'checkbox',
    },
  }
}

// Cancelling the click restores the checkbox, and React's onChange fires
// from that click, so it is dropped too.
function preventToggle({
  onClick,
}: Pick<BooleanControlRootProps, 'onClick'>): Pick<
  BooleanControlRootProps,
  'onChange' | 'onClick'
> {
  return {
    onChange: () => {},
    onClick: (event) => {
      onClick?.(event)
      event.preventDefault()
    },
  }
}
