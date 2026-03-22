import type { ButtonProps } from './useButton'
import { useButton } from './useButton'

export function Button(props: ButtonProps) {
  const {
    disabled,
    disabledBehavior = 'native',
    isLoading = false,
    onClick,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onPointerDown,
    onTouchStart,
    type,
    ...hookProps
  } = props
  const { buttonProps, preventActivation, whenEnabled } = useButton({
    ...hookProps,
    disabled,
    disabledBehavior,
    isLoading,
  })
  const { children, ...rootProps } = buttonProps
  const isInteractionDisabled = disabled || isLoading

  return (
    <button
      {...rootProps}
      disabled={isInteractionDisabled && disabledBehavior === 'native'}
      {...preventActivation({
        onKeyDown,
        onKeyUp,
      })}
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
