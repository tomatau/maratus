import type { ChoicesControlBuilder } from './ChoicesControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

export const getMultiListboxControl: ChoicesControlBuilder<'listbox'> = ({
  field,
  fieldControl,
}) => ({
  choicesControlProps: {
    ...suppressActivation(fieldControl.fieldControlProps, field.isLoading),
    ...fieldControl.validityHandlerProps,
    ref: mergeRefs(
      fieldControl.fieldControlProps.ref,
      fieldControl.validityHandlerProps.ref,
    ),
    'aria-labelledby': field.labelId,
    'aria-multiselectable': true,
    role: 'listbox',
  },
  getChoicesItemProps: ({ isDisabled, isSelected, ref, ...optionProps }) => ({
    ...suppressActivation(optionProps, isItemDisabled(field, isDisabled)),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    ...(isItemDisabled(field, isDisabled) ? { 'aria-disabled': true } : {}),
    'aria-selected': isSelected,
    role: 'option',
  }),
})
