import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'
import { omitUnsupportedReadOnly } from './omitUnsupportedReadOnly'

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
      ...omitUnsupportedReadOnly('ChoiceControl radio option', inputProps),
      ...fieldControl.validityHandlerProps,
      ref: mergeRefs(inputProps.ref, fieldControl.validityHandlerProps.ref),
      ...(isItemDisabled(field, isDisabled) ? { disabled: true } : {}),
      name: field.name,
      ...(field.isRequired ? { required: true } : {}),
      type: 'radio',
      value,
    }
  },
})
