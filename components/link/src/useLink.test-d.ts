import { useLink } from '.'

// GPRD-004 useLink returns named prop bags
export const RESULT_KEYS: Record<keyof ReturnType<typeof useLink>, true> = {
  linkProps: true,
}
