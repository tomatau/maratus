import type { FieldErrorKey, FieldErrorPolicy } from './FieldContext'
import type {
  ControlRenderArgs,
  ControlRole,
  ErrorMessageItemProps,
} from './useField'
import type {
  ElementType,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'
import { FieldProvider } from './FieldContext'
import {
  useControl,
  useDescription,
  useErrorMessage,
  useFieldRoot,
  useLabel,
} from './useField'

export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  activeErrors?: ReadonlySet<FieldErrorKey>
  as?: ElementType
  controlId?: string
  description?: ReactNode
  errorMap?: ReadonlyMap<FieldErrorKey, ReactNode>
  errorPolicy?: FieldErrorPolicy
  isReadOnly?: boolean
  isRequired?: boolean
  label: ReactNode
  name: string
}

export function FieldRoot(props: FieldRootProps) {
  const {
    activeErrors,
    as: Root = 'div',
    className,
    controlId,
    description,
    errorMap,
    errorPolicy,
    isReadOnly,
    isRequired,
    label,
    name,
    ...rest
  } = props
  const { fieldRootProps } = useFieldRoot({ className })

  return (
    <FieldProvider
      activeErrors={activeErrors}
      controlId={controlId}
      description={description}
      errorMap={errorMap}
      errorPolicy={errorPolicy}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      label={label}
      name={name}
    >
      <Root
        {...rest}
        {...fieldRootProps}
      />
    </FieldProvider>
  )
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  const { children, htmlFor, id, ...rest } = props
  const { labelProps } = useLabel({ children, htmlFor, id })

  return (
    <label
      {...rest}
      {...labelProps}
    />
  )
}

export type ControlProps = {
  children: (props: ControlRenderArgs) => ReactNode
  role?: ControlRole
}

export function Control(props: ControlProps) {
  const { children, role } = props
  const control = useControl({ role })

  return children(control)
}

export type DescriptionProps = HTMLAttributes<HTMLDivElement> & {
  as?: ElementType
}

export function Description(props: DescriptionProps) {
  const { as: Root = 'div', children, id, ...rest } = props
  const { descriptionProps } = useDescription({ children, id })

  return (
    <Root
      {...rest}
      {...descriptionProps}
    />
  )
}

export type ErrorMessageProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  as?: ElementType
  renderChildren?: (props: ErrorMessageItemProps) => ReactNode
}

export function ErrorMessage(props: ErrorMessageProps) {
  const { as: Root = 'div', id, renderChildren, ...rest } = props
  const { errorMessageProps, items } = useErrorMessage({ id })

  return (
    <Root
      {...rest}
      {...errorMessageProps}
    >
      {items.map((item) =>
        renderChildren ? (
          renderChildren(item)
        ) : (
          <p
            className={item.className}
            key={item.key}
          >
            {item.children}
          </p>
        ),
      )}
    </Root>
  )
}
