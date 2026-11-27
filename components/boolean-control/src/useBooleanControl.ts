import type {
  BooleanControlMode,
  UseBooleanControlOptions,
  UseBooleanControlResult,
} from './BooleanControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { mergeRefs, omitPropWithWarning } from '@maratus-lib/props'
import { getCustomBooleanControl } from './getCustomBooleanControl'
import { getNativeBooleanControl } from './getNativeBooleanControl'

const UNSUPPORTED_READ_ONLY_WARNING =
  'BooleanControl: HTML readonly does not apply to checkboxes. Use FieldRoot isReadOnly instead.'

export function useBooleanControl(
  options?: UseBooleanControlOptions<'native'>,
): UseBooleanControlResult<'native'>
export function useBooleanControl<TMode extends BooleanControlMode>(
  options: UseBooleanControlOptions<TMode>,
): UseBooleanControlResult<TMode>
// BooleanControl passes its props through, so its render prop is dropped here.
export function useBooleanControl(
  options: UseBooleanControlOptions<BooleanControlMode> & {
    children?: unknown
  } = {},
): UseBooleanControlResult<BooleanControlMode> {
  const {
    checked,
    children: _children,
    disabled,
    mode,
    role,
    ...fieldControlOptions
  } = options
  const field = useFieldContext('BooleanControl')
  const { fieldControlProps, validityHandlerProps } = useFieldControl(
    omitPropWithWarning(
      fieldControlOptions,
      'readOnly',
      UNSUPPORTED_READ_ONLY_WARNING,
    ),
  )
  const isInteractionDisabled = disabled === true || field.isLoading
  const controlProps = {
    ...fieldControlProps,
    ...validityHandlerProps,
    ref: mergeRefs(fieldControlProps.ref, validityHandlerProps.ref),
  }

  return mode === 'custom'
    ? getCustomBooleanControl({
        checked,
        controlProps,
        field,
        isInteractionDisabled,
        role,
      })
    : getNativeBooleanControl({
        checked,
        controlProps,
        field,
        isInteractionDisabled,
        role,
      })
}
