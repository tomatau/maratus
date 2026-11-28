import type {
  ChoicesControlBuilder,
  ChoicesControlMode,
  UseChoicesControlOptions,
  UseChoicesControlResult,
} from './ChoicesControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { omitPropWithWarning } from '@maratus-lib/props'
import { getCheckboxesControl } from './getCheckboxesControl'
import { getCheckboxItemsControl } from './getCheckboxItemsControl'
import { getMultiListboxControl } from './getMultiListboxControl'

const UNSUPPORTED_READ_ONLY_WARNING =
  'ChoicesControl: HTML readonly does not apply to this control. Use FieldRoot isReadOnly instead.'

export function useChoicesControl(
  options?: UseChoicesControlOptions<'checkboxes'>,
): UseChoicesControlResult<'checkboxes'>
export function useChoicesControl<TMode extends ChoicesControlMode>(
  options: UseChoicesControlOptions<TMode>,
): UseChoicesControlResult<TMode>
// ChoicesControl passes its props through, so its render prop is dropped here.
export function useChoicesControl(
  options: UseChoicesControlOptions & { children?: unknown } = {},
): UseChoicesControlResult {
  const {
    children: _children,
    mode = 'checkboxes',
    ...fieldControlOptions
  } = omitPropWithWarning(options, 'readOnly', UNSUPPORTED_READ_ONLY_WARNING)
  const field = useFieldContext('ChoicesControl')
  const fieldControl = useFieldControl(fieldControlOptions)
  const buildChoicesControl: ChoicesControlBuilder<ChoicesControlMode> =
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
