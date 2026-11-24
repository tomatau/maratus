import { useDescription } from '.'

// GPRD-004 useDescription returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useDescription>,
  true
> = {
  descriptionProps: true,
}
