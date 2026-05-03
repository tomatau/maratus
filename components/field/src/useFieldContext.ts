import type { FieldContextValue } from './Field.types'
import { useContext } from 'react'
import { FieldContext } from './FieldContext'

export function useFieldContext(componentName: string): FieldContextValue {
  const context = useContext(FieldContext)

  if (!context) {
    throw new globalThis.Error(
      `${componentName} must be rendered inside FieldRoot.`,
    )
  }

  return context
}
