import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { useCallback } from 'react'
import styles from './button.module.css'

type HTMLButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

type PublicNativeButtonProps = Omit<HTMLButtonProps, 'aria-pressed' | 'role'>

type ManagedRootProps =
  | 'children'
  | 'className'
  | 'data-loading'
  | 'disabled'
  | 'onClick'
  | 'onMouseDown'
  | 'onPointerDown'
  | 'onTouchStart'
  | 'type'

export type DisabledBehavior = 'native' | 'focusable'

type CommonButtonProps = PublicNativeButtonProps & {
  disabledBehavior?: DisabledBehavior
  isLoading?: boolean
}

type CommandButtonProps = {
  kind?: 'command'
  pressed?: never
}

type ToggleButtonProps = {
  kind: 'toggle'
  pressed: boolean | 'mixed'
}

export type ButtonProps = CommonButtonProps &
  (CommandButtonProps | ToggleButtonProps)

export type ButtonRootProps = Omit<HTMLButtonProps, ManagedRootProps> & {
  'aria-pressed'?: HTMLButtonProps['aria-pressed']
  className?: string
  children?: HTMLButtonProps['children']
  'data-loading'?: ''
}

export type WhenEnabled = <T extends object>(props: T) => T | {}

export type UseButtonResult = {
  buttonProps: ButtonRootProps

  /**
   * Helper function that suppresses props when the button is disabled
   */
  whenEnabled: WhenEnabled
}

export function useButton(props: ButtonProps): UseButtonResult {
  const {
    'aria-busy': ariaBusy,
    'aria-disabled': ariaDisabled,
    className,
    disabled,
    disabledBehavior: _disabledBehavior,
    isLoading = false,
    kind = 'command',
    pressed,
    children,
    ...nativeProps
  } = props
  const isInteractionDisabled = disabled || isLoading
  const ariaPressed = kind === 'toggle' ? pressed : undefined

  const whenEnabled = useCallback<WhenEnabled>(
    <T extends object>(enabledProps: T) =>
      isInteractionDisabled ? {} : enabledProps,
    [isInteractionDisabled],
  )

  return {
    buttonProps: {
      ...nativeProps,
      'aria-busy': ariaBusy ?? (isLoading ? true : undefined),
      'aria-disabled':
        ariaDisabled ?? (isInteractionDisabled ? true : undefined),
      'aria-pressed': ariaPressed,
      children,
      className: clsx(styles.button, className),
      'data-loading': isLoading ? '' : undefined,
    },
    whenEnabled,
  }
}
