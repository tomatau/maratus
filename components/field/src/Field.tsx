import type {
  ControlRenderArgs,
  ErrorMessageItemProps,
  FieldErrorKey,
  FieldErrorPolicy,
  UseControlOptions,
  UseDescriptionOptions,
  UseErrorMessageOptions,
  UseLabelOptions,
} from './Field.types'
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react'
import { FieldProvider } from './FieldContext'
import { useControl } from './useControl'
import { useDescription } from './useDescription'
import { useErrorMessage } from './useErrorMessage'
import { useFieldRoot } from './useFieldRoot'
import { useLabel } from './useLabel'

export type FieldRootProps = ComponentPropsWithRef<'div'> & {
  activeErrors?: ReadonlySet<FieldErrorKey>
  as?: ElementType
  controlId?: string
  description?: ReactNode
  errorMap?: ReadonlyMap<FieldErrorKey, ReactNode>
  errorPolicy?: FieldErrorPolicy
  isLoading?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  label: ReactNode
  name: string
}

export function FieldRoot(props: FieldRootProps) {
  const {
    activeErrors,
    as: Root = 'div',
    controlId,
    description,
    errorMap,
    errorPolicy,
    isLoading,
    isReadOnly,
    isRequired,
    label,
    name,
    ...hookProps
  } = props
  const { fieldRootProps } = useFieldRoot({ ...hookProps, isLoading })

  return (
    <FieldProvider
      activeErrors={activeErrors}
      controlId={controlId}
      description={description}
      errorMap={errorMap}
      errorPolicy={errorPolicy}
      isLoading={isLoading}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      label={label}
      name={name}
    >
      <Root {...fieldRootProps} />
    </FieldProvider>
  )
}

export type LabelProps = UseLabelOptions

export function Label(props: LabelProps) {
  const { labelProps } = useLabel(props)

  return <label {...labelProps} />
}

export type ControlProps = UseControlOptions & {
  children: (props: ControlRenderArgs) => ReactNode
}

export function Control(props: ControlProps) {
  const { children, ...hookProps } = props
  const control = useControl(hookProps)

  return children(control)
}

export type DescriptionProps = UseDescriptionOptions & {
  as?: ElementType
}

export function Description(props: DescriptionProps) {
  const { as: Root = 'div', ...hookProps } = props
  const { descriptionProps } = useDescription(hookProps)

  return <Root {...descriptionProps} />
}

export type ErrorMessageProps = UseErrorMessageOptions & {
  as?: ElementType
  renderChildren?: (props: ErrorMessageItemProps) => ReactNode
}

export function ErrorMessage(props: ErrorMessageProps) {
  const { as: Root = 'div', renderChildren, ...hookProps } = props
  const { errorMessageProps, items } = useErrorMessage(hookProps)

  return (
    <Root {...errorMessageProps}>
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
