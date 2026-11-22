import type {
  ChoiceControlBuilder,
  ChoiceControlMode,
  UseChoiceControlOptions,
  UseChoiceControlResult,
} from './ChoiceControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { getListboxControl } from './getListboxControl'
import { getRadioItemsControl } from './getRadioItemsControl'
import { getRadiosControl } from './getRadiosControl'
import { getSelectControl } from './getSelectControl'
import { omitUnsupportedReadOnly } from './omitUnsupportedReadOnly'

export function useChoiceControl<TMode extends ChoiceControlMode>(
  options: UseChoiceControlOptions<TMode>,
): UseChoiceControlResult<TMode> {
  const { mode, ...fieldControlOptions } = omitUnsupportedReadOnly(
    'ChoiceControl',
    options,
  )
  const field = useFieldContext('ChoiceControl')
  const fieldControl = useFieldControl(fieldControlOptions)
  const buildChoiceControl: ChoiceControlBuilder<TMode> =
    choiceControlBuilders[mode]

  return buildChoiceControl({ field, fieldControl })
}

const choiceControlBuilders: {
  [TMode in ChoiceControlMode]: ChoiceControlBuilder<TMode>
} = {
  listbox: getListboxControl,
  'radio-items': getRadioItemsControl,
  radios: getRadiosControl,
  select: getSelectControl,
}
