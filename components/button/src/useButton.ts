import type {
  ButtonHTMLAttributes,
  KeyboardEventHandler,
  MouseEventHandler,
  PointerEventHandler,
  TouchEventHandler,
} from 'react'
import { useIsFocusVisible } from '@maratus-lib/focus-modality'
import clsx from 'clsx'
import styles from './Button.module.css'

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

export type ButtonBaseProps = CommonButtonProps &
  (CommandButtonProps | ToggleButtonProps)

export type UseButtonProps = ButtonBaseProps & {
  isNative?: boolean
}

type ButtonRootProps = NativeButtonProps & {
  'data-focus-visible'?: ''
  'data-loading'?: ''
}

export type UseButtonResult = {
  buttonProps: ButtonRootProps
}

export function useButton(props: UseButtonProps): UseButtonResult {
  const {
    'aria-busy': ariaBusy,
    'aria-disabled': ariaDisabled,
    className,
    disabled,
    disabledBehavior = 'native',
    isNative = true,
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
  const activationOptions = {
    isInteractionDisabled,
    isNative,
    disabledBehavior,
  }

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
      ...getRootSemanticsProps(activationOptions, nativeProps),
      disabled:
        isNative && isInteractionDisabled && disabledBehavior === 'native'
          ? true
          : undefined,
      ...getPointerActivationHandlerProps(activationOptions, {
        onClick,
        onMouseDown,
        onPointerDown,
        onTouchStart,
      }),
      ...getKeyboardActivationHandlerProps(activationOptions, {
        onKeyDown,
        onKeyUp,
      }),
      type: isNative ? type : undefined,
    },
  }
}

type ActivationHandlerProps = {
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>
}

type ActivationPhase = keyof ActivationHandlerProps

type ActivationOptions = {
  isNative: boolean
  disabledBehavior?: CommonButtonProps['disabledBehavior']
  isInteractionDisabled: boolean
}

type RootSemanticsProps = Pick<ButtonRootProps, 'role' | 'tabIndex'>

function getRootSemanticsProps(
  { isNative, isInteractionDisabled, disabledBehavior }: ActivationOptions,
  { tabIndex }: UseButtonProps,
): RootSemanticsProps {
  if (isNative) return {}
  return {
    role: 'button',
    tabIndex:
      tabIndex ??
      (isInteractionDisabled && disabledBehavior === 'native' ? -1 : 0),
  }
}

function getKeyboardActivationHandlerProps(
  options: ActivationOptions,
  props: ActivationHandlerProps,
): ActivationHandlerProps {
  const createActivationHandler = (
    phase: ActivationPhase,
    handler?: KeyboardEventHandler<HTMLButtonElement>,
  ) =>
    preventNonFocusActivation(
      phase,
      options,
      options.isNative ? handler : createKeyboardClickHandler(phase, handler),
    )

  return {
    onKeyDown: createActivationHandler('onKeyDown', props.onKeyDown),
    onKeyUp: createActivationHandler('onKeyUp', props.onKeyUp),
  }
}

type PointerActivationHandlerProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>
  onMouseDown?: MouseEventHandler<HTMLButtonElement>
  onPointerDown?: PointerEventHandler<HTMLButtonElement>
  onTouchStart?: TouchEventHandler<HTMLButtonElement>
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

const activationKeysByPhase: Record<ActivationPhase, Set<string>> = {
  onKeyDown: new Set(['Enter', ' ']),
  onKeyUp: new Set([' ']),
}

function preventNonFocusActivation(
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

function createKeyboardClickHandler(
  phase: ActivationPhase,
  handler?: KeyboardEventHandler<HTMLButtonElement>,
): KeyboardEventHandler<HTMLButtonElement> | undefined {
  return (event) => {
    if (phase === 'onKeyDown' && event.key === ' ') {
      event.preventDefault()
    }

    handler?.(event)

    if (event.defaultPrevented) {
      return
    }

    const shouldDispatchClick =
      (phase === 'onKeyDown' && event.key === 'Enter') ||
      (phase === 'onKeyUp' && event.key === ' ')

    if (shouldDispatchClick) {
      event.preventDefault()
      event.currentTarget.click()
    }
  }
}
