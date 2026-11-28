import type { ChoiceControlBuilder } from './ChoiceControl.types'
import { mergeRefs, omitProps } from '@maratus-lib/props'

export const getSelectControl: ChoiceControlBuilder<'select'> = ({
  field,
  fieldControl,
}) => ({
  choiceControlProps: {
    ...omitProps(fieldControl.fieldControlProps, [
      'aria-disabled',
      'aria-required',
    ]),
    ...fieldControl.validityHandlerProps,
    ref: mergeRefs(
      fieldControl.fieldControlProps.ref,
      fieldControl.validityHandlerProps.ref,
    ),
    ...(field.isLoading ? { disabled: true } : {}),
    name: field.name,
    ...(field.isRequired ? { required: true } : {}),
  },
})
