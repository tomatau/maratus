import type { ButtonProps } from './useButton'
import { useButton } from './useButton'

export function Button(props: ButtonProps) {
  const { buttonProps, whenEnabled } = useButton(props)
  const { children, ...rootProps } = buttonProps
  const {
    canFocus = false,
    disabled,
    isLoading = false,
    onClick,
    onMouseDown,
    onPointerDown,
    onTouchStart,
    type = 'button',
  } = props

  return (
    <button
      {...rootProps}
      disabled={(disabled || isLoading) && !canFocus}
      {...whenEnabled({
        onClick,
        onMouseDown,
        onPointerDown,
        onTouchStart,
      })}
      type={type}
    >
      {children}
    </button>
  )
}
