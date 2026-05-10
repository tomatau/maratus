import type {
  FieldControlRenderProps,
  TextControlRenderProps,
  UseTextControlOptions,
  UseTextControlResult,
} from './Field.types'
import { useFieldContext as useRequiredFieldContext } from './useFieldContext'
import { useFieldControl } from './useFieldControl'

export function useTextControl(
  options: UseTextControlOptions = {},
): UseTextControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useRequiredFieldContext('TextControl')
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
  field: ReturnType<typeof useRequiredFieldContext>,
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
