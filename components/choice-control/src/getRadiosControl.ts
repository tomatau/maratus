import type { ChoiceControlBuilder } from './ChoiceControl.types'
import {
  mergeRefs,
  omitPropWithWarning,
  preventActivationBehavior,
} from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoiceControl radio option: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

export const getRadiosControl: ChoiceControlBuilder<'radios'> = ({
  field,
  fieldControl,
}) => ({
  choiceControlProps: {
    ...fieldControl.fieldControlProps,
    'aria-labelledby': field.labelId,
    role: 'radiogroup',
  },
  getChoiceInputProps: ({ isDisabled, value, ...inputProps }) => {
    return {
      // Readonly cancels the click, so the radios keep their checked state.
      ...preventActivationBehavior(
        {
          ...omitPropWithWarning(
            inputProps,
            'readOnly',
            UNSUPPORTED_READ_ONLY_WARNING,
          ),
          ...fieldControl.validityHandlerProps,
        },
        field.isReadOnly,
      ),
      ref: mergeRefs(inputProps.ref, fieldControl.validityHandlerProps.ref),
      ...(isItemDisabled(field, isDisabled) ? { disabled: true } : {}),
      name: field.name,
      ...(field.isRequired ? { required: true } : {}),
      type: 'radio',
      value,
    }
  },
})
