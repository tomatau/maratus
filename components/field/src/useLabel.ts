import type { UseLabelOptions, UseLabelResult } from './Field.types'
import { useFieldContext } from './useFieldContext'

export function useLabel(options: UseLabelOptions): UseLabelResult {
  const { children, htmlFor, id } = options
  const field = useFieldContext('Label')

  return {
    labelProps: {
      children: children ?? field.label,
      'data-readonly': field.isReadOnly ? '' : undefined,
      'data-required': field.isRequired ? '' : undefined,
      htmlFor: htmlFor ?? field.controlId,
      id: id ?? field.labelId,
    },
  }
}
