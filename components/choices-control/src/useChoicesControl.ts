import type {
  ChoicesControlBuilder,
  ChoicesControlMode,
  UseChoicesControlOptions,
  UseChoicesControlResult,
} from './ChoicesControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { getCheckboxesControl } from './getCheckboxesControl'
import { getCheckboxItemsControl } from './getCheckboxItemsControl'
import { getMultiListboxControl } from './getMultiListboxControl'
import { omitUnsupportedReadOnly } from './omitUnsupportedReadOnly'

export function useChoicesControl<TMode extends ChoicesControlMode>(
  options: UseChoicesControlOptions<TMode>,
): UseChoicesControlResult<TMode> {
  const { mode, ...fieldControlOptions } = omitUnsupportedReadOnly(
    'ChoicesControl',
    options,
  )
  const field = useFieldContext('ChoicesControl')
  const fieldControl = useFieldControl(fieldControlOptions)
  const buildChoicesControl: ChoicesControlBuilder<TMode> =
    choicesControlBuilders[mode]

  return buildChoicesControl({ field, fieldControl })
}

const choicesControlBuilders: {
  [TMode in ChoicesControlMode]: ChoicesControlBuilder<TMode>
} = {
  'checkbox-items': getCheckboxItemsControl,
  checkboxes: getCheckboxesControl,
  listbox: getMultiListboxControl,
}
