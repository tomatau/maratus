import type { FieldContextValue } from '@maratus-component/field'

// Loading suppresses activation, so it disables every item.
export function isItemDisabled(
  field: Pick<FieldContextValue, 'isLoading'>,
  isDisabled: boolean | undefined,
): boolean {
  return Boolean(isDisabled) || field.isLoading
}
