import { useBooleanControl } from '.'

// GPRD-004 useBooleanControl returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useBooleanControl>,
  true
> = {
  booleanControlProps: true,
}
