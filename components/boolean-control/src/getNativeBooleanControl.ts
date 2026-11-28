import type {
  NativeBooleanControlInput,
  UseNativeBooleanControlResult,
} from './BooleanControl.types'
import {
  omitProps,
  preventActivationBehavior,
  suppressActivation,
} from '@maratus-lib/props'

export function getNativeBooleanControl({
  checked,
  controlProps,
  disabledState,
  field,
  role,
}: NativeBooleanControlInput): UseNativeBooleanControlResult {
  const isFocusableDisabled = disabledState === 'focusableDisabled'
  // Readonly keeps the consumer's onClick; a disabled checkbox gets no click.
  const rootProps = preventActivationBehavior(
    suppressActivation(
      // Native attributes carry these states, so their ARIA forms must not.
      omitProps(controlProps, [
        'aria-checked',
        'aria-disabled',
        'aria-required',
      ]),
      isFocusableDisabled,
    ),
    field.isReadOnly || isFocusableDisabled,
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
      // A native checkbox already has the checkbox role.
      ...(role === 'switch' ? { role } : {}),
      type: 'checkbox',
    },
  }
}
