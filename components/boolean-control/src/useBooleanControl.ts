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
import { mergeRefs } from '@maratus-lib/props'

export function useBooleanControl(
  options: UseBooleanControlOptions = {},
): UseBooleanControlResult {
  const { role, ...fieldControlOptions } = options
  const field = useFieldContext('BooleanControl')
  const { fieldControlProps, validityHandlerProps } =
    useFieldControl(fieldControlOptions)
  const controlProps = {
    ...fieldControlProps,
    ...validityHandlerProps,
    ref: mergeRefs(fieldControlProps.ref, validityHandlerProps.ref),
  }

  if (role) {
    return {
      booleanControlProps: {
        ...controlProps,
        ...(field.isRequired ? { 'aria-required': true } : {}),
        role,
      },
    }
  }

  return {
    booleanControlProps: getNativeBooleanControlProps(controlProps, field),
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
