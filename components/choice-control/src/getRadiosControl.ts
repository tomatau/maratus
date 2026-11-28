import type { ChoiceControlBuilder } from './ChoiceControl.types'
import {
  mergeRefs,
  omitPropWithWarning,
  preventActivationBehavior,
  suppressActivation,
} from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoiceControl radio option: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

export const getRadiosControl: ChoiceControlBuilder<'radios'> = ({
  disabledBehavior,
  field,
  fieldControl,
}) => ({
  choiceControlProps: {
    ...fieldControl.fieldControlProps,
    'aria-labelledby': field.labelId,
    role: 'radiogroup',
  },
  getChoiceInputProps: ({ disabled, value, ...inputProps }) => {
    const isDisabled = isItemDisabled(field, disabled)
    const isFocusableDisabled = isDisabled && disabledBehavior === 'focusable'

    return {
      // Readonly cancels the click, so the radios keep their checked state.
      ...preventActivationBehavior(
        // A disabled radio gets no click, so consumer activation is skipped too.
        suppressActivation(
          {
            ...omitPropWithWarning(
              inputProps,
              'readOnly',
              UNSUPPORTED_READ_ONLY_WARNING,
            ),
            ...fieldControl.validityHandlerProps,
          },
          isFocusableDisabled,
        ),
        field.isReadOnly || isFocusableDisabled,
      ),
      ref: mergeRefs(inputProps.ref, fieldControl.validityHandlerProps.ref),
      ...(isFocusableDisabled ? { 'aria-disabled': true } : {}),
      ...(isDisabled && !isFocusableDisabled ? { disabled: true } : {}),
      // A focusable disabled radio keeps its name to stay in its group.
      name: field.name,
      // A focusable disabled radio leaves validation, as a disabled one does.
      ...(field.isRequired && !isFocusableDisabled ? { required: true } : {}),
      type: 'radio',
      value,
    }
  },
})
