import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { useCallback } from 'react'
import styles from './button.module.css'

type HTMLButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

type PublicNativeButtonProps = Pick<
  HTMLButtonProps,
  | 'aria-busy'
  | 'aria-describedby'
  | 'aria-disabled'
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'className'
  | 'disabled'
  | 'onClick'
  | 'onMouseDown'
  | 'onPointerDown'
  | 'onTouchStart'
  | 'type'
>

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

export type ButtonRootProps = {
  'aria-busy'?: HTMLButtonProps['aria-busy']
  'aria-describedby'?: HTMLButtonProps['aria-describedby']
  'aria-disabled'?: HTMLButtonProps['aria-disabled']
  'aria-label'?: HTMLButtonProps['aria-label']
  'aria-labelledby'?: HTMLButtonProps['aria-labelledby']
  'aria-pressed'?: HTMLButtonProps['aria-pressed']
  children?: HTMLButtonProps['children']
  className?: string
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
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': ariaDisabled,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    className,
    disabled,
    isLoading = false,
    children,
  } = props
  const isInteractionDisabled = disabled || isLoading
  const ariaPressed = props.kind === 'toggle' ? props.pressed : undefined

  const whenEnabled = useCallback<WhenEnabled>(
    <T extends object>(enabledProps: T) =>
      isInteractionDisabled ? {} : enabledProps,
    [isInteractionDisabled],
  )

  return {
    buttonProps: {
      'aria-busy': ariaBusy ?? (isLoading ? true : undefined),
      'aria-describedby': ariaDescribedBy,
      'aria-disabled':
        ariaDisabled ?? (isInteractionDisabled ? true : undefined),
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-pressed': ariaPressed,
      children,
      className: clsx(styles.button, className),
      'data-loading': isLoading ? '' : undefined,
    },
    whenEnabled,
  }
}
