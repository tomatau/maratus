import { useTextControl } from '.'

// GPRD-004 useTextControl returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useTextControl>,
  true
> = {
  textControlProps: true,
}
