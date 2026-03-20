import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { useCallback } from 'react'
import styles from './button.module.css'

type HTMLButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = HTMLButtonProps & {
  canFocus?: boolean
  isLoading?: boolean
  isPressed?: boolean
}

export type ButtonRootProps = {
  className?: string
  'aria-busy'?: HTMLButtonProps['aria-busy']
  'aria-disabled'?: HTMLButtonProps['aria-disabled']
  'aria-pressed'?: HTMLButtonProps['aria-pressed']
  'data-loading'?: ''
  'data-pressed'?: ''
  children?: HTMLButtonProps['children']
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
    'aria-pressed': ariaPressed,
    className,
    disabled,
    isLoading = false,
    isPressed,
    children,
  } = props
  const isInteractionDisabled = disabled || isLoading

  const whenEnabled = useCallback<WhenEnabled>(
    <T extends object>(enabledProps: T) =>
      isInteractionDisabled ? {} : enabledProps,
    [isInteractionDisabled],
  )

  return {
    buttonProps: {
      children,
      'aria-busy': ariaBusy ?? (isLoading ? true : undefined),
      'aria-disabled':
        ariaDisabled ?? (disabled || isLoading ? true : undefined),
      'aria-pressed': isPressed ?? ariaPressed,
      className: clsx(styles.button, className),
      'data-loading': isLoading ? '' : undefined,
      'data-pressed': isPressed ? '' : undefined,
    },
    whenEnabled,
  }
}
