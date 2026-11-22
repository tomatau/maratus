import type { ChoicesControlBuilder } from './ChoicesControl.types'
import { mergeRefs } from '@maratus-lib/props'
import { getGroupControlProps } from './getGroupControlProps'
import { isItemDisabled } from './isItemDisabled'
import { omitUnsupportedReadOnly } from './omitUnsupportedReadOnly'

export const getCheckboxesControl: ChoicesControlBuilder<'checkboxes'> = ({
  field,
  fieldControl,
}) => ({
  choicesControlProps: getGroupControlProps(
    field,
    fieldControl.fieldControlProps,
  ),
  getChoicesInputProps: ({ isDisabled, name, value, ...inputProps }) => {
    return {
      ...omitUnsupportedReadOnly('ChoicesControl checkbox option', inputProps),
      ...fieldControl.validityHandlerProps,
      ref: mergeRefs(inputProps.ref, fieldControl.validityHandlerProps.ref),
      ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
      ...(isItemDisabled(field, isDisabled) ? { disabled: true } : {}),
      name: name ?? field.name,
      type: 'checkbox',
      value,
    }
  },
})
