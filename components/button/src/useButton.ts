import type { ButtonHTMLAttributes, KeyboardEventHandler } from 'react'
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

type ActivationHandlerProps = {
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
}

export type PreventActivation = (
  props: ActivationHandlerProps,
) => ActivationHandlerProps

export type UseButtonResult = {
  buttonProps: ButtonRootProps

  /**
   * Helper function that suppresses props when the button is disabled
   */
  whenEnabled: WhenEnabled

  /**
   * Helper function that prevents keyboard-triggered activation while the
   * button remains focusable.
   */
  preventActivation: PreventActivation
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

  const preventActivation = useCallback<PreventActivation>(
    ({ onKeyDown, onKeyUp }) => ({
      onKeyDown: wrapActivationHandler(
        'onKeyDown',
        {
          disabledBehavior: props.disabledBehavior,
          isInteractionDisabled,
        },
        onKeyDown,
      ),
      onKeyUp: wrapActivationHandler(
        'onKeyUp',
        {
          disabledBehavior: props.disabledBehavior,
          isInteractionDisabled,
        },
        onKeyUp,
      ),
    }),
    [isInteractionDisabled, props.disabledBehavior],
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
    preventActivation,
    whenEnabled,
  }
}

type ActivationPhase = keyof ActivationHandlerProps
const activationKeysByPhase: Record<ActivationPhase, Set<string>> = {
  onKeyDown: new Set(['Enter', ' ']),
  onKeyUp: new Set([' ']),
}

function wrapActivationHandler(
  phase: ActivationPhase,
  options: {
    disabledBehavior?: DisabledBehavior
    isInteractionDisabled: boolean
  },
  handler?: KeyboardEventHandler<HTMLButtonElement>,
): KeyboardEventHandler<HTMLButtonElement> | undefined {
  if (!handler && !options.isInteractionDisabled) {
    return undefined
  }

  // Native buttons still activate from the keyboard when they remain focusable.
  // Block Enter on keydown and Space on both keydown and keyup so focusable
  // disabled buttons stay inert without losing focusability.
  return (event) => {
    const shouldPrevent =
      options.isInteractionDisabled &&
      options.disabledBehavior === 'focusable' &&
      activationKeysByPhase[phase].has(event.key)

    if (shouldPrevent) {
      event.preventDefault()
      return
    }

    handler?.(event)
  }
}
