import type { UseChoicesControlResult } from '.'
import { useChoicesControl } from '.'

// GPRD-004 useChoicesControl returns named prop bags in checkbox-items mode
export const CHECKBOX_ITEMS_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoicesControl<'checkbox-items'>>,
  true
> = {
  choicesControlProps: true,
  getChoicesItemProps: true,
}

// GPRD-004 useChoicesControl returns named prop bags in checkboxes mode
export const CHECKBOXES_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoicesControl<'checkboxes'>>,
  true
> = {
  choicesControlProps: true,
  getChoicesInputProps: true,
}

// GPRD-004 useChoicesControl returns named prop bags in listbox mode
export const LISTBOX_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoicesControl<'listbox'>>,
  true
> = {
  choicesControlProps: true,
  getChoicesItemProps: true,
}

// GPRD-003 useChoicesControl without a mode returns the checkboxes result
export const DEFAULT_MODE: () => UseChoicesControlResult<'checkboxes'> = () =>
  useChoicesControl()

// GPRD-003 requires a custom mode to be named
export const CUSTOM_MODE_WITHOUT_MODE = () =>
  // @ts-expect-error mode is required for a custom mode
  useChoicesControl<'listbox'>({})
