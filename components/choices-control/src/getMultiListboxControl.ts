import type { ChoicesControlBuilder } from './ChoicesControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

export const getMultiListboxControl: ChoicesControlBuilder<'listbox'> = ({
  field,
  fieldControl,
}) => ({
  choicesControlProps: {
    // Readonly blocks the consumer's activation, which owns the selection.
    ...suppressActivation(
      fieldControl.fieldControlProps,
      field.isLoading || field.isReadOnly,
    ),
    ...fieldControl.validityHandlerProps,
    ref: mergeRefs(
      fieldControl.fieldControlProps.ref,
      fieldControl.validityHandlerProps.ref,
    ),
    'aria-labelledby': field.labelId,
    'aria-multiselectable': true,
    role: 'listbox',
  },
  getChoicesItemProps: ({ disabled, isSelected, ref, ...optionProps }) => ({
    ...suppressActivation(
      optionProps,
      isItemDisabled(field, disabled) || field.isReadOnly,
    ),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    ...(isItemDisabled(field, disabled) ? { 'aria-disabled': true } : {}),
    'aria-selected': isSelected,
    role: 'option',
  }),
})
