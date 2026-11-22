import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { FieldRoot } from './Field'
import { FieldProvider } from './FieldContext'
import { useFieldRoot } from './useFieldRoot'

const ROOT_OPTIONS = { className: 'parity-root', isLoading: true }

describe(useFieldRoot, () => {
  test('PRD-021 renders the same root as FieldRoot inside a FieldProvider', () => {
    const viaComponent = renderToString(
      <FieldRoot
        {...ROOT_OPTIONS}
        label="Parity field"
        name="parity-field"
      />,
    )

    const viaHook = renderToString(
      <FieldProvider
        isLoading={ROOT_OPTIONS.isLoading}
        label="Parity field"
        name="parity-field"
      >
        <HookRoot />
      </FieldProvider>,
    )

    expect(viaHook).toBe(viaComponent)
  })
})

function HookRoot() {
  const { fieldRootProps } = useFieldRoot(ROOT_OPTIONS)

  return <div {...fieldRootProps} />
}
