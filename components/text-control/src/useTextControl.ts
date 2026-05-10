import type {
  TextControlRenderProps,
  UseTextControlOptions,
  UseTextControlResult,
} from './TextControl.types'
import type {
  FieldContextValue,
  FieldControlRenderProps,
} from '@maratus-component/field'
import { useFieldContext, useFieldControl } from '@maratus-component/field'

export function useTextControl(
  options: UseTextControlOptions = {},
): UseTextControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useFieldContext('TextControl')
  const { fieldControlProps, withValidity } =
    useFieldControl(fieldControlOptions)

  if (role) {
    return {
      textControlProps: {
        ...fieldControlProps,
        role,
      },
      withValidity,
    }
  }

  return {
    textControlProps: getNativeTextControlProps(fieldControlProps, field),
    withValidity,
  }
}

function getNativeTextControlProps(
  fieldControlProps: FieldControlRenderProps,
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
