import type { RadioInputOptions } from './ChoiceControl.types'

export const READONLY_RADIO_OPTIONS: RadioInputOptions = {
  // @ts-expect-error PRD-005 native radios do not accept readOnly
  readOnly: true,
  value: 'radio',
}
