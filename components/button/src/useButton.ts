import type {
  ButtonHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  TouchEventHandler,
} from 'react'
import { useIsFocusVisible } from '@maratus-lib/focus-modality'
import clsx from 'clsx'
import styles from './button.module.css'

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

type CommonButtonProps = Omit<NativeButtonProps, 'aria-pressed' | 'role'> & {
  disabledBehavior?: 'native' | 'focusable'
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

type ButtonRootProps = NativeButtonProps & {
  'data-focus-visible'?: ''
  'data-loading'?: ''
}

export type UseButtonResult = {
  buttonProps: ButtonRootProps
}

export function useButton(props: ButtonProps): UseButtonResult {
  const {
    'aria-busy': ariaBusy,
    'aria-disabled': ariaDisabled,
    className,
    disabled,
    disabledBehavior = 'native',
    isLoading = false,
    kind = 'command',
    onClick,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onPointerDown,
    onTouchStart,
    pressed,
    children,
    type,
    ...nativeProps
  } = props
  const isInteractionDisabled = disabled || isLoading
  const ariaPressed = kind === 'toggle' ? pressed : undefined
  const isFocusVisible = useIsFocusVisible()

  return {
    buttonProps: {
      ...nativeProps,
      'aria-busy': ariaBusy ?? (isLoading ? true : undefined),
      'aria-disabled':
        ariaDisabled ?? (isInteractionDisabled ? true : undefined),
      'aria-pressed': ariaPressed,
      children,
      className: clsx(styles.button, className),
      'data-focus-visible': isFocusVisible ? '' : undefined,
      'data-loading': isLoading ? '' : undefined,
      disabled: isInteractionDisabled && disabledBehavior === 'native',
      ...getPointerActivationHandlerProps(
        { isInteractionDisabled },
        {
          onClick,
          onMouseDown,
          onPointerDown,
          onTouchStart,
        },
      ),
      ...getKeyboardActivationHandlerProps(
        { isInteractionDisabled, disabledBehavior },
        {
          onKeyDown,
          onKeyUp,
        },
      ),
      type,
    },
  }
}

type ActivationHandlerProps = {
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
}

type PointerActivationHandlerProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  onPointerDown?: PointerEventHandler<HTMLButtonElement>
  onTouchStart?: TouchEventHandler<HTMLButtonElement>
}

type ActivationPhase = keyof ActivationHandlerProps

const activationKeysByPhase: Record<ActivationPhase, Set<string>> = {
  onKeyDown: new Set(['Enter', ' ']),
  onKeyUp: new Set([' ']),
}

type ActivationOptions = {
  disabledBehavior?: CommonButtonProps['disabledBehavior']
  isInteractionDisabled: boolean
}

function getKeyboardActivationHandlerProps(
  options: ActivationOptions,
  props: ActivationHandlerProps,
): ActivationHandlerProps {
  return {
    onKeyDown: wrapActivationHandler('onKeyDown', options, props.onKeyDown),
    onKeyUp: wrapActivationHandler('onKeyUp', options, props.onKeyUp),
  }
}

function getPointerActivationHandlerProps(
  options: ActivationOptions,
  props: PointerActivationHandlerProps,
): PointerActivationHandlerProps {
  if (options.isInteractionDisabled) {
    return {}
  }

  return {
    onClick: props.onClick,
    onMouseDown: props.onMouseDown,
    onPointerDown: props.onPointerDown,
    onTouchStart: props.onTouchStart,
  }
}

function wrapActivationHandler(
  phase: ActivationPhase,
  options: ActivationOptions,
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
