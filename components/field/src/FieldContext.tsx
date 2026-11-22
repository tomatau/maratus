import type {
  FieldContextValue,
  FieldErrorKey,
  FieldErrorPolicy,
  FieldErrorPolicyArgs,
  FieldErrorPolicyFieldState,
  FieldErrorPolicyFormState,
  FieldProviderProps,
} from './Field.types'
import type { ValidityReports } from './fieldValidity'
import { createContext, useCallback, useId, useRef, useState } from 'react'
import {
  getReportedErrorKeys,
  pruneDisconnectedReporters,
  recordValidityReport,
} from './fieldValidity'

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
  const validityReports = useRef<ValidityReports>(new Map())
  // A reporting input can unmount without a validity event. Its ref cleanup
  // runs before React removes the node, so the prune waits for a microtask.
  const validityReporterRef = useCallback(
    () => () => {
      queueMicrotask(() => {
        if (!pruneDisconnectedReporters(validityReports.current)) return

        const errors = getReportedErrorKeys(validityReports.current)
        setNativeState((state) => ({ ...state, errors }))
      })
    },
    [],
  )

  const generatedId = useId()
  const resolvedControlId = controlId ?? `${generatedId}-control`
  const currentErrors = activeErrors ?? new Set(nativeState.errors)
  const visibleErrors = resolveVisibleErrors({
    activeErrors: currentErrors,
    errorPolicy,
    form: defaultFormState,
    nativeState,
  })
  const isErrorVisible = visibleErrors.length > 0

  return {
    activeErrors,
    controlId: resolvedControlId,
    description,
    descriptionId: `${generatedId}-description`,
    errorId: `${generatedId}-error`,
    errorMap,
    updateValidityState: (event, report) => {
      recordValidityReport(validityReports.current, report)
      const nextErrors = getReportedErrorKeys(validityReports.current)
      const nextActiveErrors = activeErrors ?? new Set(nextErrors)

      setNativeState((currentNativeState) => {
        const nextNativeState = getNextNativeState({
          currentNativeState,
          errorPolicy,
          event,
          isErrorVisible,
          nextActiveErrors,
          nextErrors,
        })

        return isSameNativeState(currentNativeState, nextNativeState)
          ? currentNativeState
          : nextNativeState
      })
    },
    isLoading,
    isReadOnly,
    isRequired,
    label,
    labelId: `${generatedId}-label`,
    name,
    validityReporterRef,
    visibleErrors,
  }
}

function getNextNativeState({
  currentNativeState,
  errorPolicy,
  event,
  isErrorVisible,
  nextActiveErrors,
  nextErrors,
}: {
  currentNativeState: FieldNativeState
  errorPolicy: FieldErrorPolicy
  event: FieldErrorPolicyArgs['event']
  isErrorVisible: boolean
  nextActiveErrors: ReadonlySet<FieldErrorKey>
  nextErrors: readonly FieldErrorKey[]
}): FieldNativeState {
  const eventNativeState: FieldNativeState = {
    errors: nextErrors,
    event,
    field: {
      wasBlurred: currentNativeState.field.wasBlurred || event === 'blur',
      wasChanged:
        currentNativeState.field.wasChanged ||
        event === 'change' ||
        event === 'input',
      wasErrored: currentNativeState.field.wasErrored || isErrorVisible,
      wasTouched:
        currentNativeState.field.wasTouched ||
        event === 'focus' ||
        event === 'blur' ||
        event === 'change' ||
        event === 'input' ||
        event === 'invalid',
    },
    isErrorVisible,
  }
  const nextVisibleErrors = resolveVisibleErrors({
    activeErrors: nextActiveErrors,
    errorPolicy,
    form: defaultFormState,
    nativeState: eventNativeState,
  })
  const nextIsErrorVisible = nextVisibleErrors.length > 0

  return {
    ...eventNativeState,
    field: {
      ...eventNativeState.field,
      wasErrored: eventNativeState.field.wasErrored || nextIsErrorVisible,
    },
    isErrorVisible: nextIsErrorVisible,
  }
}

function isSameNativeState(
  current: FieldNativeState,
  next: FieldNativeState,
): boolean {
  const fieldKeys = Object.keys(
    current.field,
  ) as (keyof FieldErrorPolicyFieldState)[]

  return (
    current.event === next.event &&
    current.isErrorVisible === next.isErrorVisible &&
    current.errors.length === next.errors.length &&
    current.errors.every((key, index) => key === next.errors[index]) &&
    fieldKeys.every((key) => current.field[key] === next.field[key])
  )
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
