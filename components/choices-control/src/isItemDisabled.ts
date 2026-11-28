import type { FieldContextValue } from '@maratus-component/field'

// Loading suppresses activation, so it disables every item.
export function isItemDisabled(
  field: Pick<FieldContextValue, 'isLoading'>,
  disabled: boolean | undefined,
): boolean {
  return Boolean(disabled) || field.isLoading
}
