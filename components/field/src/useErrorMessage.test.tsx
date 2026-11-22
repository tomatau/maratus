import type { FieldErrorKey } from './Field.types'
import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { ErrorMessage, FieldRoot } from './Field'
import { useErrorMessage } from './useErrorMessage'

const ERROR_MESSAGE_OPTIONS = { className: 'parity-error' }

const ERROR_MAP = new Map<FieldErrorKey, string>([
  ['valueMissing', 'Value missing.'],
  ['typeMismatch', 'Type mismatch.'],
])

describe(useErrorMessage, () => {
  test('PRD-025 renders the same error message as ErrorMessage', () => {
    const viaComponent = renderInField(
      <ErrorMessage {...ERROR_MESSAGE_OPTIONS} />,
    )

    const viaHook = renderInField(<HookErrorMessage />)

    expect(viaHook).toBe(viaComponent)
  })
})

function HookErrorMessage() {
  const { errorMessageProps, items } = useErrorMessage(ERROR_MESSAGE_OPTIONS)

  return (
    <div {...errorMessageProps}>
      {items.map((item) => (
        <p
          className={item.className}
          key={item.key}
        >
          {item.children}
        </p>
      ))}
    </div>
  )
}

function renderInField(errorMessage: ReactNode): string {
  return renderToString(
    <FieldRoot
      activeErrors={new Set(ERROR_MAP.keys())}
      errorMap={ERROR_MAP}
      label="Parity field"
      name="parity-field"
    >
      {errorMessage}
    </FieldRoot>,
  )
}
