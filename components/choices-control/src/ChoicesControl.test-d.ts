import type { CheckboxInputOptions } from './ChoicesControl.types'

export const READONLY_CHECKBOX_OPTIONS: CheckboxInputOptions = {
  // @ts-expect-error PRD-006 native checkboxes do not accept readOnly
  readOnly: true,
  value: 'checkbox',
}
