import { useErrorMessage } from '.'

// GPRD-004 useErrorMessage returns named prop bags
export const RESULT_KEYS: Record<
  keyof ReturnType<typeof useErrorMessage>,
  true
> = {
  errorMessageProps: true,
  items: true,
}
