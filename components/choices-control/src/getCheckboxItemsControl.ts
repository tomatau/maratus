import type { ChoicesControlBuilder } from './ChoicesControl.types'
import { mergeRefs, suppressActivation } from '@maratus-lib/props'
import { getGroupControlProps } from './getGroupControlProps'
import { isItemDisabled } from './isItemDisabled'

export const getCheckboxItemsControl: ChoicesControlBuilder<
  'checkbox-items'
> = ({ field, fieldControl }) => ({
  choicesControlProps: {
    // Readonly blocks the consumer's activation, which owns the selection.
    ...suppressActivation(
      getGroupControlProps(field, fieldControl.fieldControlProps),
      field.isLoading || field.isReadOnly,
    ),
    ...fieldControl.validityHandlerProps,
    ref: mergeRefs(
      fieldControl.fieldControlProps.ref,
      fieldControl.validityHandlerProps.ref,
    ),
  },
  getChoicesItemProps: ({ disabled, isSelected, ref, ...itemProps }) => ({
    ...suppressActivation(
      itemProps,
      isItemDisabled(field, disabled) || field.isReadOnly,
    ),
    ...(ref ? { ref: mergeRefs(ref) } : {}),
    'aria-checked': isSelected,
    ...(isItemDisabled(field, disabled) ? { 'aria-disabled': true } : {}),
    ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
    role: 'checkbox',
  }),
})
