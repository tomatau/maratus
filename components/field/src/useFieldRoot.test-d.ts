import { useFieldRoot } from '.'

// GPRD-004 useFieldRoot returns named prop bags
export const RESULT_KEYS: Record<keyof ReturnType<typeof useFieldRoot>, true> =
  {
    fieldRootProps: true,
  }
