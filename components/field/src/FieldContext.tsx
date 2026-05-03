import type {
  FieldContextValue,
  FieldErrorKey,
  FieldErrorPolicy,
  FieldErrorPolicyArgs,
  FieldErrorPolicyFieldState,
  FieldErrorPolicyFormState,
  FieldProviderProps,
  ValidityErrorKey,
} from './Field.types'
import { createContext, useId, useState } from 'react'

type FieldNativeState = {
  errors: readonly FieldErrorKey[]
  event: FieldErrorPolicyArgs['event']
  field: FieldErrorPolicyFieldState
  isErrorVisible: boolean
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function FieldProvider(props: FieldProviderProps) {
  const { children, ...options } = props
  const contextValue = useFieldProviderValue(options)

  return (
    <FieldContext.Provider value={contextValue}>
      {children}
    </FieldContext.Provider>
  )
}

type UseFieldProviderValueOptions = Omit<FieldProviderProps, 'children'>

const defaultFormState: FieldErrorPolicyFormState = {
  wasSubmitted: false,
}

function useFieldProviderValue({
  activeErrors,
  controlId,
  description,
  errorMap,
  errorPolicy = defaultErrorPolicy,
  isLoading = false,
  isReadOnly = false,
  isRequired = false,
  label,
  name,
}: UseFieldProviderValueOptions): FieldContextValue {
  const [nativeState, setNativeState] = useState<FieldNativeState>({
    errors: [],
    event: 'invalid',
    field: {
      wasBlurred: false,
      wasChanged: false,
      wasErrored: false,
      wasTouched: false,
    },
    isErrorVisible: false,
  })
  const generatedId = useId()
  const resolvedControlId = controlId ?? `${generatedId}-control`
  const currentErrors = activeErrors ?? new Set(nativeState.errors)
  const visibleErrors = resolveVisibleErrors({
    activeErrors: currentErrors,
    errorPolicy,
    form: defaultFormState,
    nativeState,
  })
  const nextIsErrorVisible = visibleErrors.length > 0

  if (
    nativeState.isErrorVisible !== nextIsErrorVisible ||
    (nextIsErrorVisible && !nativeState.field.wasErrored)
  ) {
    setNativeState({
      ...nativeState,
      field: {
        ...nativeState.field,
        wasErrored: nativeState.field.wasErrored || nextIsErrorVisible,
      },
      isErrorVisible: nextIsErrorVisible,
    })
  }

  return {
    activeErrors,
    controlId: resolvedControlId,
    description,
    descriptionId: `${generatedId}-description`,
    errorId: `${generatedId}-error`,
    errorMap,
    evaluateNativeValidity: (event, control) => {
      const nextErrors = getValidityErrorKeys(control.validity)

      setNativeState((currentNativeState) => ({
        errors: nextErrors,
        event,
        field: {
          wasBlurred: currentNativeState.field.wasBlurred || event === 'blur',
          wasChanged:
            currentNativeState.field.wasChanged ||
            event === 'change' ||
            event === 'input',
          wasErrored: currentNativeState.field.wasErrored,
          wasTouched:
            currentNativeState.field.wasTouched ||
            event === 'focus' ||
            event === 'blur' ||
            event === 'change' ||
            event === 'input' ||
            event === 'invalid',
        },
        isErrorVisible: currentNativeState.isErrorVisible,
      }))
    },
    isLoading,
    isReadOnly,
    isRequired,
    label,
    labelId: `${generatedId}-label`,
    name,
    visibleErrors,
  }
}

const validityErrorKeys = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
] as const satisfies readonly ValidityErrorKey[]

function getValidityErrorKeys(
  validity: ValidityState,
): readonly ValidityErrorKey[] {
  return validity.valid ? [] : validityErrorKeys.filter((key) => validity[key])
}

function resolveVisibleErrors({
  activeErrors,
  errorPolicy,
  form,
  nativeState,
}: {
  activeErrors: ReadonlySet<FieldErrorKey>
  errorPolicy: FieldErrorPolicy
  form: FieldErrorPolicyFormState
  nativeState: FieldNativeState
}): readonly FieldErrorKey[] {
  const result = errorPolicy({
    activeErrors,
    event: nativeState.event,
    field: nativeState.field,
    form,
    isErrorVisible: nativeState.isErrorVisible,
    isValid: activeErrors.size === 0,
  })

  if (result === false) return []
  if (result === true) return [...activeErrors]
  return result.filter((errorKey) => activeErrors.has(errorKey))
}

function defaultErrorPolicy(args: FieldErrorPolicyArgs): boolean {
  if (args.isValid) return false
  if (args.event === 'invalid') return true
  if (args.field.wasErrored) return true
  if (args.field.wasBlurred) return true
  return false
}
