import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs } from '@maratus-lib/props'

export const getSelectControl: ChoiceControlBuilder<'select'> = ({
  field,
  fieldControl,
}) => {
  const selectFieldProps = { ...fieldControl.fieldControlProps }

  delete selectFieldProps['aria-disabled']
  delete selectFieldProps['aria-required']

  return {
    choiceControlProps: {
      ...selectFieldProps,
      ...fieldControl.validityHandlerProps,
      ref: mergeRefs(
        fieldControl.fieldControlProps.ref,
        fieldControl.validityHandlerProps.ref,
      ),
      ...(field.isLoading ? { disabled: true } : {}),
      name: field.name,
      ...(field.isRequired ? { required: true } : {}),
    },
  }
}
