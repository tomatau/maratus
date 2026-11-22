import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

export const getRadioItemsControl: ChoiceControlBuilder<'radio-items'> = ({
  field,
  fieldControl,
}) => ({
  choiceControlProps: {
    ...suppressActivation(fieldControl.fieldControlProps, field.isLoading),
    ...fieldControl.validityHandlerProps,
    ref: mergeRefs(
      fieldControl.fieldControlProps.ref,
      fieldControl.validityHandlerProps.ref,
    ),
    'aria-labelledby': field.labelId,
    role: 'radiogroup',
  },
  getChoiceItemProps: ({ isDisabled, isSelected, ref, ...itemProps }) => ({
    ...suppressActivation(itemProps, isItemDisabled(field, isDisabled)),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    'aria-checked': isSelected,
    ...(isItemDisabled(field, isDisabled) ? { 'aria-disabled': true } : {}),
    role: 'radio',
  }),
})
