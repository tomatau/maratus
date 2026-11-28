import type { ChoicesControlBuilder } from './ChoicesControl.types'
import {
  mergeRefs,
  omitPropWithWarning,
  preventActivationBehavior,
} from '@maratus-lib/props'
import { getGroupControlProps } from './getGroupControlProps'
import { isItemDisabled } from './isItemDisabled'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoicesControl checkbox option: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

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
      // Readonly cancels the click, so each checkbox keeps its checked state.
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
      ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
      ...(isItemDisabled(field, isDisabled) ? { disabled: true } : {}),
      name: name ?? field.name,
      type: 'checkbox',
      value,
    }
  },
})
