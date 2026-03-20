import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import styles from './button.module.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  isPressed?: boolean
}

export function Button(props: ButtonProps) {
  const {
    'aria-busy': ariaBusy,
    className,
    disabled,
    isLoading = false,
    isPressed,
    type = 'button',
    ...rest
  } = props

  return (
    <button
      {...rest}
      aria-busy={isLoading || ariaBusy ? true : undefined}
      aria-pressed={isPressed}
      className={clsx(styles.button, className)}
      data-loading={isLoading ? '' : undefined}
      data-pressed={isPressed ? '' : undefined}
      disabled={disabled || isLoading}
      type={type}
    />
  )
}
