import type {
  BooleanControlDisabledBehavior,
  BooleanControlDisabledState,
  BooleanControlMode,
  UseBooleanControlOptions,
  UseBooleanControlResult,
} from './BooleanControl.types'
import { useFieldContext, useFieldControl } from '@maratus-component/field'
import { mergeRefs, omitPropWithWarning } from '@maratus-lib/props'
import clsx from 'clsx'
import { getCustomBooleanControl } from './getCustomBooleanControl'
import { getNativeBooleanControl } from './getNativeBooleanControl'
import styles from './BooleanControl.module.css'

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
    disabledBehavior = 'native',
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
  const disabledState = getDisabledState({
    disabledBehavior,
    isDisabled: disabled === true || field.isLoading,
  })
  const controlProps = {
    ...fieldControlProps,
    ...validityHandlerProps,
    className: clsx(styles.booleanControl, fieldControlProps.className),
    ref: mergeRefs(fieldControlProps.ref, validityHandlerProps.ref),
  }

  return mode === 'custom'
    ? getCustomBooleanControl({
        checked,
        controlProps,
        disabledState,
        field,
        role,
      })
    : getNativeBooleanControl({
        checked,
        controlProps,
        disabledState,
        field,
        role,
      })
}

function getDisabledState({
  disabledBehavior,
  isDisabled,
}: {
  disabledBehavior: BooleanControlDisabledBehavior
  isDisabled: boolean
}): BooleanControlDisabledState {
  if (!isDisabled) return 'enabled'
  return disabledBehavior === 'focusable' ? 'focusableDisabled' : 'disabled'
}
