import type {
  CustomBooleanControlInput,
  UseCustomBooleanControlResult,
} from './BooleanControl.types'

export function getCustomBooleanControl({
  checked,
  controlProps,
  field,
  isInteractionDisabled,
  role,
}: CustomBooleanControlInput): UseCustomBooleanControlResult {
  return {
    booleanControlProps: {
      ...controlProps,
      'aria-checked': checked,
      ...(isInteractionDisabled ? { 'aria-disabled': true } : {}),
      // A custom root is not labelable, so it names itself from the label.
      'aria-labelledby': field.labelId,
      role,
    },
  }
}
