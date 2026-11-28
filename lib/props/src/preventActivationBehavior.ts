import type { MouseEvent } from 'react'

type ActivationBehaviorHandlers = {
  onChange?: unknown
  onClick?: (event: MouseEvent<never>) => void
}

// React fires onChange from the cancelled click, so it is dropped too.
export function preventActivationBehavior<
  TProps extends ActivationBehaviorHandlers,
>(props: TProps, isPrevented: boolean): TProps & ActivationBehaviorHandlers {
  if (!isPrevented) return props

  const { onClick } = props

  return {
    ...props,
    onChange: () => {},
    onClick: (event: MouseEvent<never>) => {
      onClick?.(event)
      event.preventDefault()
    },
  }
}
