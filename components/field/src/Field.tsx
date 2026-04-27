import type { FieldContextValue } from './FieldContext'
import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'
import clsx from 'clsx'
import { useId, useState } from 'react'
import { FieldContext, useFieldContext } from './FieldContext'
import styles from './Field.module.css'

export type FieldRootProps = HTMLAttributes<HTMLDivElement> & {
  activeErrors?: readonly string[]
  controlId?: string
  description?: ReactNode
  errorMap?: ReadonlyMap<string, ReactNode>
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
    label,
    name,
    ...rest
  } = props
  const [nativeErrors, setNativeErrors] = useState<readonly string[]>([])
  const generatedId = useId()
  const resolvedControlId = controlId ?? `${generatedId}-control`
  const visibleErrors = activeErrors ?? nativeErrors
  const contextValue: FieldContextValue = {
    activeErrors,
    controlId: resolvedControlId,
    description,
    descriptionId: `${generatedId}-description`,
    errorId: `${generatedId}-error`,
    errorMap,
    label,
    labelId: `${generatedId}-label`,
    name,
    setNativeErrors,
    visibleErrors,
  }

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        {...rest}
        className={clsx(styles.field, className)}
      />
    </FieldContext.Provider>
  )
}

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export function Label(props: LabelProps) {
  const { children, htmlFor, id, ...rest } = props
  const field = useFieldContext('Label')

  return (
    <label
      {...rest}
      htmlFor={htmlFor ?? field.controlId}
      id={id ?? field.labelId}
    >
      {children ?? field.label}
    </label>
  )
}

type ControlRenderProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-errormessage'
  | 'aria-invalid'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onInput'
  | 'onInvalid'
>

export type ControlProps = {
  children: (props: ControlRenderProps) => ReactNode
}

export function Control(props: ControlProps) {
  const field = useFieldContext('Control')
  const validityHandlers = createValidityHandlerProps(field)

  return props.children({
    'aria-describedby': field.description ? field.descriptionId : undefined,
    'aria-errormessage':
      field.visibleErrors.length > 0 ? field.errorId : undefined,
    'aria-invalid': field.visibleErrors.length > 0 ? true : undefined,
    id: field.controlId,
    name: field.name,
    ...validityHandlers,
  })
}

export type DescriptionProps = HTMLAttributes<HTMLDivElement>

export function Description(props: DescriptionProps) {
  const { children, id, ...rest } = props
  const field = useFieldContext('Description')

  return (
    <div
      {...rest}
      id={id ?? field.descriptionId}
    >
      {children ?? field.description}
    </div>
  )
}

export type ErrorMessageProps = HTMLAttributes<HTMLDivElement>

export function ErrorMessage(props: ErrorMessageProps) {
  const { children, id, ...rest } = props
  const field = useFieldContext('ErrorMessage')
  const errorMessages = field.visibleErrors
    .map((errorKey) => [errorKey, field.errorMap?.get(errorKey)] as const)
    .filter((entry): entry is readonly [string, ReactNode] => entry[1] != null)

  return (
    <div
      {...rest}
      id={id ?? field.errorId}
      role={field.visibleErrors.length > 0 ? 'alert' : undefined}
    >
      {children ??
        errorMessages.map(([errorKey, message]) => (
          <p
            className={styles.errorMessage}
            key={errorKey}
          >
            {message}
          </p>
        ))}
    </div>
  )
}

function createValidityHandlerProps(
  field: FieldContextValue,
): Pick<ControlRenderProps, 'onBlur' | 'onChange' | 'onInput' | 'onInvalid'> {
  if (field.activeErrors) {
    return {}
  }

  const setNativeErrors = (control: HTMLInputElement) => {
    field.setNativeErrors(getValidityErrorKeys(control.validity))
  }

  return {
    onBlur: (event) => setNativeErrors(event.currentTarget),
    onChange: (event) => setNativeErrors(event.currentTarget),
    onInput: (event) => setNativeErrors(event.currentTarget),
    onInvalid: (event) => setNativeErrors(event.currentTarget),
  }
}

const validityErrorKeys = [
  'valueMissing',
  'typeMismatch',
  'patternMismatch',
  'tooShort',
  'tooLong',
  'rangeUnderflow',
  'rangeOverflow',
  'stepMismatch',
  'badInput',
  'customError',
] as const

function getValidityErrorKeys(validity: ValidityState): readonly string[] {
  if (validity.valid) {
    return []
  }

  return validityErrorKeys.filter((key) => validity[key])
}
