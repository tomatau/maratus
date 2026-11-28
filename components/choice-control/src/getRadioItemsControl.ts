import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { isItemDisabled } from './isItemDisabled'

export const getRadioItemsControl: ChoiceControlBuilder<'radio-items'> = ({
  field,
  fieldControl,
}) => ({
  choiceControlProps: {
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
    role: 'radiogroup',
  },
  getChoiceItemProps: ({ disabled, isSelected, ref, ...itemProps }) => ({
    ...suppressActivation(
      itemProps,
      isItemDisabled(field, disabled) || field.isReadOnly,
    ),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    'aria-checked': isSelected,
    ...(isItemDisabled(field, disabled) ? { 'aria-disabled': true } : {}),
    role: 'radio',
  }),
})
