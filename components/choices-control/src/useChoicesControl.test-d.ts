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
