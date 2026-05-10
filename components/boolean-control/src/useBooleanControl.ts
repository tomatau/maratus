import type {
  BooleanControlRenderProps,
  UseBooleanControlOptions,
  UseBooleanControlResult,
} from './BooleanControl.types'
import type {
  FieldContextValue,
  FieldControlRenderProps,
} from '@maratus-component/field'
import { useFieldContext, useFieldControl } from '@maratus-component/field'

export function useBooleanControl(
  options: UseBooleanControlOptions = {},
): UseBooleanControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useFieldContext('BooleanControl')
  const { fieldControlProps, withValidity } =
    useFieldControl(fieldControlOptions)

  if (role) {
    return {
      booleanControlProps: {
        ...fieldControlProps,
        ...(field.isRequired ? { 'aria-required': true } : {}),
        role,
      },
      withValidity,
    }
  }

  return {
    booleanControlProps: getNativeBooleanControlProps(fieldControlProps, field),
    withValidity,
  }
}

function getNativeBooleanControlProps(
  fieldControlProps: FieldControlRenderProps,
  field: FieldContextValue,
): BooleanControlRenderProps {
  const booleanControlProps = { ...fieldControlProps }

  delete booleanControlProps['aria-readonly']
  delete booleanControlProps['aria-required']

  return {
    ...booleanControlProps,
    ...(field.isLoading ? { disabled: true } : {}),
    name: field.name,
    ...(field.isRequired ? { required: true } : {}),
    type: 'checkbox',
  }
}
