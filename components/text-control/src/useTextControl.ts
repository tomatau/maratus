import type {
  TextControlRenderProps,
  UseTextControlOptions,
  UseTextControlResult,
} from './TextControl.types'
import type {
  FieldContextValue,
  FieldControlRenderProps,
  ValidityHandlerProps,
} from '@maratus-component/field'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { mergeRefs } from '@maratus-lib/props'

export function useTextControl(
  options: UseTextControlOptions = {},
): UseTextControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useFieldContext('TextControl')
  const { fieldControlProps, validityHandlerProps } =
    useFieldControl(fieldControlOptions)
  const controlProps = {
    ...fieldControlProps,
    ...validityHandlerProps,
    ref: mergeRefs(fieldControlProps.ref, validityHandlerProps.ref),
  }

  if (role) {
    return {
      textControlProps: {
        ...controlProps,
        role,
      },
    }
  }

  return {
    textControlProps: getNativeTextControlProps(controlProps, field),
  }
}

function getNativeTextControlProps(
  fieldControlProps: FieldControlRenderProps & ValidityHandlerProps,
  field: FieldContextValue,
): TextControlRenderProps {
  const textControlProps = { ...fieldControlProps }

  delete textControlProps['aria-readonly']
  delete textControlProps['aria-required']

  return {
    ...textControlProps,
    ...(field.isLoading ? { disabled: true } : {}),
    name: field.name,
    ...(field.isReadOnly ? { readOnly: true } : {}),
    ...(field.isRequired ? { required: true } : {}),
  }
}
