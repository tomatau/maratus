import type {
  BooleanControlRootProps,
  NativeBooleanControlInput,
  UseNativeBooleanControlResult,
} from './BooleanControl.types'
import { omitProps, suppressActivation } from '@maratus-lib/props'

export function getNativeBooleanControl({
  checked,
  controlProps,
  disabledState,
  field,
  role,
}: NativeBooleanControlInput): UseNativeBooleanControlResult {
  const isFocusableDisabled = disabledState === 'focusableDisabled'
  // A disabled checkbox gets no click, so consumer activation is skipped too.
  const rootProps = suppressActivation(
    // Native attributes carry these states, so their ARIA forms must not.
    omitProps(controlProps, ['aria-checked', 'aria-disabled', 'aria-required']),
    isFocusableDisabled,
  )

  return {
    booleanControlProps: {
      ...rootProps,
      // Without checked, the browser keeps the state.
      ...(checked === undefined ? {} : { checked }),
      ...(disabledState === 'disabled' ? { disabled: true } : {}),
      // A focusable disabled checkbox leaves its form, as a disabled one does.
      ...(isFocusableDisabled
        ? { 'aria-disabled': true }
        : {
            name: field.name,
            ...(field.isRequired ? { required: true } : {}),
          }),
      ...(field.isReadOnly || isFocusableDisabled
        ? preventToggle(rootProps)
        : {}),
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
