import type { KeyboardEvent } from 'react'

type ActivationHandlers = {
  onClick?: unknown
  onKeyDown?: (event: KeyboardEvent<never>) => void
  onKeyUp?: (event: KeyboardEvent<never>) => void
  onMouseDown?: unknown
  onPointerDown?: unknown
  onTouchStart?: unknown
}

const ACTIVATION_KEYS = new Set(['Enter', ' '])

// Lets a component suppress consumer activation, for example while it is
// loading or disabled. Pointer handlers are dropped, and key handlers skip
// Enter and Space, so other keys can still move focus.
export function suppressActivation<TProps extends ActivationHandlers>(
  props: TProps,
  isSuppressed: boolean,
): TProps {
  if (!isSuppressed) return props

  const {
    onClick: _onClick,
    onKeyDown,
    onKeyUp,
    onMouseDown: _onMouseDown,
    onPointerDown: _onPointerDown,
    onTouchStart: _onTouchStart,
    ...otherProps
  } = props

  return {
    ...otherProps,
    ...(onKeyDown ? { onKeyDown: skipActivationKeys(onKeyDown) } : {}),
    ...(onKeyUp ? { onKeyUp: skipActivationKeys(onKeyUp) } : {}),
  } as TProps
}

function skipActivationKeys<TEvent extends KeyboardEvent<never>>(
  handler: (event: TEvent) => void,
): (event: TEvent) => void {
  return (event) => {
    if (ACTIVATION_KEYS.has(event.key)) {
      event.preventDefault()
      return
    }

    handler(event)
  }
}
