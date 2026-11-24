import { useFieldControl } from '.'

// GPRD-004 useFieldControl returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useFieldControl>,
  true
> = {
  fieldControlProps: true,
  validityHandlerProps: true,
}
