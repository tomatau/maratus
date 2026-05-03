import type { UseDescriptionOptions, UseDescriptionResult } from './Field.types'
import { useFieldContext } from './useFieldContext'

export function useDescription(
  options: UseDescriptionOptions,
): UseDescriptionResult {
  const { children, id } = options
  const field = useFieldContext('Description')

  return {
    descriptionProps: {
      children: children ?? field.description,
      id: id ?? field.descriptionId,
    },
  }
}
