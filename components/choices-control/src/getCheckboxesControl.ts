import type { ChoicesControlBuilder } from './ChoicesControl.types'
import {
  mergeRefs,
  omitPropWithWarning,
  preventActivationBehavior,
  suppressActivation,
} from '@maratus-lib/props'
import { getGroupControlProps } from './getGroupControlProps'
import { isItemDisabled } from './isItemDisabled'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoicesControl checkbox option: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

export const getCheckboxesControl: ChoicesControlBuilder<'checkboxes'> = ({
  disabledBehavior,
  field,
  fieldControl,
}) => ({
  choicesControlProps: getGroupControlProps(
    field,
    fieldControl.fieldControlProps,
  ),
  getChoicesInputProps: ({
    disabled,
    name,
    required,
    value,
    ...inputProps
  }) => {
    const isDisabled = isItemDisabled(field, disabled)
    const isFocusableDisabled = isDisabled && disabledBehavior === 'focusable'

    return {
      // Readonly cancels the click, so each checkbox keeps its checked state.
      ...preventActivationBehavior(
        // A disabled checkbox gets no click, so consumer activation is skipped too.
        suppressActivation(
          {
            ...omitPropWithWarning(
              inputProps,
              'readOnly',
              UNSUPPORTED_READ_ONLY_WARNING,
            ),
            ...fieldControl.validityHandlerProps,
          },
          isFocusableDisabled,
        ),
        field.isReadOnly || isFocusableDisabled,
      ),
      ref: mergeRefs(inputProps.ref, fieldControl.validityHandlerProps.ref),
      ...(field.isReadOnly ? { 'aria-readonly': true } : {}),
      // A focusable disabled checkbox leaves its form, as a disabled one does.
      ...(isFocusableDisabled
        ? { 'aria-disabled': true }
        : {
            ...(isDisabled ? { disabled: true } : {}),
            name: name ?? field.name,
            ...(required === undefined ? {} : { required }),
          }),
      type: 'checkbox',
      value,
    }
  },
})
