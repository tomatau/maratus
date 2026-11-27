import type {
  BooleanControlRootProps,
  CustomBooleanControlInput,
  UseCustomBooleanControlResult,
} from './BooleanControl.types'
import { suppressActivation } from '@maratus-lib/props'

export function getCustomBooleanControl({
  checked,
  controlProps,
  disabledState,
  field,
  role,
}: CustomBooleanControlInput): UseCustomBooleanControlResult {
  // Readonly blocks the consumer's onClick, which owns the checked state.
  const isActivationBlocked = disabledState !== 'enabled' || field.isReadOnly
  const { onKeyDown, onKeyUp, ...rootProps } = suppressActivation(
    controlProps,
    isActivationBlocked,
  )

  return {
    booleanControlProps: {
      ...rootProps,
      'aria-checked': checked,
      ...(disabledState === 'enabled' ? {} : { 'aria-disabled': true }),
      // A custom root is not labelable, so it names itself from the label.
      'aria-labelledby': field.labelId,
      onKeyDown: preventSpaceScroll(onKeyDown),
      onKeyUp: isActivationBlocked ? onKeyUp : clickOnSpace(onKeyUp),
      role,
      tabIndex:
        controlProps.tabIndex ?? (disabledState === 'disabled' ? -1 : 0),
    },
  }
}

type KeyHandler = NonNullable<BooleanControlRootProps['onKeyDown']>

function preventSpaceScroll(onKeyDown: KeyHandler | undefined): KeyHandler {
  return (event) => {
    if (event.key === ' ') event.preventDefault()
    onKeyDown?.(event)
  }
}

// Space activates on keyup, as on a native checkbox.
function clickOnSpace(onKeyUp: KeyHandler | undefined): KeyHandler {
  return (event) => {
    onKeyUp?.(event)
    if (event.key !== ' ' || event.defaultPrevented) return
    event.preventDefault()
    event.currentTarget.click()
  }
}
