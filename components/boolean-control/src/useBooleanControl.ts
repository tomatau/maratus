import type {
  BooleanControlRenderProps,
  UseBooleanControlOptions,
  UseBooleanControlResult,
} from './BooleanControl.types'
import type {
  FieldContextValue,
  FieldControlRenderProps,
  ValidityHandlerProps,
} from '@maratus-component/field'
import { useFieldContext, useFieldControl } from '@maratus-component/field'

export function useBooleanControl(
  options: UseBooleanControlOptions = {},
): UseBooleanControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useFieldContext('BooleanControl')
  const { fieldControlProps, validityHandlerProps, withValidity } =
    useFieldControl(fieldControlOptions)
  const controlProps = { ...fieldControlProps, ...validityHandlerProps }

  if (role) {
    return {
      booleanControlProps: {
        ...controlProps,
        ...(field.isRequired ? { 'aria-required': true } : {}),
        role,
      },
      withValidity,
    }
  }

  return {
    booleanControlProps: getNativeBooleanControlProps(controlProps, field),
    withValidity,
  }
}

function getNativeBooleanControlProps(
  fieldControlProps: FieldControlRenderProps & ValidityHandlerProps,
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
