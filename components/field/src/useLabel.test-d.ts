import { useLabel } from '.'

// GPRD-004 useLabel returns named prop bags
export const RESULT_KEYS: Record<keyof ReturnType<typeof useLabel>, true> = {
  labelProps: true,
}
