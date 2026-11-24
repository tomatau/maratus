import { useSeparator } from '.'

// GPRD-004 useSeparator returns named prop bags
export const RESULT_KEYS: Record<keyof ReturnType<typeof useSeparator>, true> =
  {
    separatorProps: true,
  }
