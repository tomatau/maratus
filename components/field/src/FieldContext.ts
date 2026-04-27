import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type FieldContextValue = {
  activeErrors?: readonly string[]
  controlId: string
  description: ReactNode
  descriptionId: string
  errorId: string
  errorMap?: ReadonlyMap<string, ReactNode>
  label: ReactNode
  labelId: string
  name: string
  setNativeErrors(errors: readonly string[]): void
  visibleErrors: readonly string[]
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldContext(componentName: string): FieldContextValue {
  const context = useContext(FieldContext)

  if (!context) {
    throw new globalThis.Error(
      `${componentName} must be rendered inside FieldRoot.`,
    )
  }

  return context
}
