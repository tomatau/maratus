import { useButton } from '.'

// GPRD-004 useButton returns named prop bags
export const RESULT_KEYS: Record<keyof ReturnType<typeof useButton>, true> = {
  buttonProps: true,
}
