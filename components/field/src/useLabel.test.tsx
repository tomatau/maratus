import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { FieldRoot, Label } from './Field'
import { useLabel } from './useLabel'

const LABEL_OPTIONS = { className: 'parity-label' }

describe(useLabel, () => {
  test('PRD-022 renders the same label as Label', () => {
    const viaComponent = renderInField(<Label {...LABEL_OPTIONS} />)

    const viaHook = renderInField(<HookLabel />)

    expect(viaHook).toBe(viaComponent)
  })
})

function HookLabel() {
  const { labelProps } = useLabel(LABEL_OPTIONS)

  return <label {...labelProps} />
}

function renderInField(label: ReactNode): string {
  return renderToString(
    <FieldRoot
      isReadOnly
      isRequired
      label="Parity field"
      name="parity-field"
    >
      {label}
    </FieldRoot>,
  )
}
