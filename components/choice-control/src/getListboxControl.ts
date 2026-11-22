import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

export const getListboxControl: ChoiceControlBuilder<'listbox'> = ({
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
    role: 'listbox',
  },
  getChoiceItemProps: ({ isDisabled, isSelected, ref, ...optionProps }) => ({
    ...suppressActivation(optionProps, isItemDisabled(field, isDisabled)),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    ...(isItemDisabled(field, isDisabled) ? { 'aria-disabled': true } : {}),
    'aria-selected': isSelected,
    role: 'option',
  }),
})
