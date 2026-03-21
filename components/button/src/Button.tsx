import type { ButtonProps } from './useButton'
import { useButton } from './useButton'

export function Button(props: ButtonProps) {
  const { buttonProps, whenEnabled } = useButton(props)
  const { children, ...rootProps } = buttonProps
  const {
    disabled,
    disabledBehavior = 'native',
    isLoading = false,
    onClick,
    onMouseDown,
    onPointerDown,
    onTouchStart,
    type,
  } = props

  return (
    <button
      {...rootProps}
      disabled={(disabled || isLoading) && disabledBehavior === 'native'}
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
