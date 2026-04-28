import type { FieldErrorKey, FieldErrorPolicy } from './FieldContext'
import type { ControlRenderProps } from './useField'
import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { FieldProvider } from './FieldContext'
import {
  useControl,
  useDescription,
  useErrorMessage,
  useLabel,
} from './useField'
import styles from './Field.module.css'

export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  activeErrors?: ReadonlySet<FieldErrorKey>
  controlId?: string
  description?: ReactNode
  errorMap?: ReadonlyMap<FieldErrorKey, ReactNode>
  errorPolicy?: FieldErrorPolicy
  label: ReactNode
  name: string
}

export function FieldRoot(props: FieldRootProps) {
  const {
    activeErrors,
    className,
    controlId,
    description,
    errorMap,
    errorPolicy,
    label,
    name,
    ...rest
  } = props
  return (
    <FieldProvider
      activeErrors={activeErrors}
      controlId={controlId}
      description={description}
      errorMap={errorMap}
      errorPolicy={errorPolicy}
      label={label}
      name={name}
    >
      <div
        {...rest}
        className={clsx(styles.field, className)}
      />
    </FieldProvider>
  )
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  const { children, htmlFor, id, ...rest } = props
  const labelProps = useLabel({ children, htmlFor, id })

  return (
    <label
      {...rest}
      {...labelProps}
    />
  )
}

export type ControlProps = {
  children: (props: ControlRenderProps) => ReactNode
}

export function Control(props: ControlProps) {
  return props.children(useControl())
}

export type DescriptionProps = HTMLAttributes<HTMLDivElement>

export function Description(props: DescriptionProps) {
  const { children, id, ...rest } = props
  const descriptionProps = useDescription({ children, id })

  return (
    <div
      {...rest}
      {...descriptionProps}
    />
  )
}

export type ErrorMessageProps = HTMLAttributes<HTMLDivElement>

export function ErrorMessage(props: ErrorMessageProps) {
  const { children, id, ...rest } = props
  const errorMessageProps = useErrorMessage({ children, id })

  return (
    <div
      {...rest}
      {...errorMessageProps}
    />
  )
}
