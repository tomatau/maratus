import type {
  ChoiceControlBuilder,
  ChoiceControlMode,
  UseChoiceControlOptions,
  UseChoiceControlResult,
} from './ChoiceControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { omitPropWithWarning } from '@maratus-lib/props'
import { getListboxControl } from './getListboxControl'
import { getRadioItemsControl } from './getRadioItemsControl'
import { getRadiosControl } from './getRadiosControl'
import { getSelectControl } from './getSelectControl'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoiceControl: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

export function useChoiceControl<TMode extends ChoiceControlMode>(
  options: UseChoiceControlOptions<TMode>,
): UseChoiceControlResult<TMode> {
  const { mode, ...fieldControlOptions } = omitPropWithWarning(
    options,
    'readOnly',
    UNSUPPORTED_READ_ONLY_WARNING,
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
