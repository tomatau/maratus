import { useChoiceControl } from '.'

// GPRD-004 useChoiceControl returns named prop bags in listbox mode
export const LISTBOX_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoiceControl<'listbox'>>,
  true
> = {
  choiceControlProps: true,
  getChoiceItemProps: true,
}

// GPRD-004 useChoiceControl returns named prop bags in radio-items mode
export const RADIO_ITEMS_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoiceControl<'radio-items'>>,
  true
> = {
  choiceControlProps: true,
  getChoiceItemProps: true,
}

// GPRD-004 useChoiceControl returns named prop bags in radios mode
export const RADIOS_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoiceControl<'radios'>>,
  true
> = {
  choiceControlProps: true,
  getChoiceInputProps: true,
}

// GPRD-004 useChoiceControl returns named prop bags in select mode
export const SELECT_RESULT_KEYS: Record<
  keyof ReturnType<typeof useChoiceControl<'select'>>,
  true
> = {
  choiceControlProps: true,
}

// GPRD-003 useChoiceControl requires a mode, since it has two native roots
export const WITHOUT_MODE = () =>
  // @ts-expect-error mode is required
  useChoiceControl({})
