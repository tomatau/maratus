import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { BooleanControl } from './BooleanControl'
import { useBooleanControl } from './useBooleanControl'

const CUSTOM_ROOT = {
  checked: false,
  mode: 'custom',
  role: 'checkbox',
} as const

describe(useBooleanControl, () => {
  test('PRD-008 renders the same native markup as BooleanControl', () => {
    const viaComponent = renderInField(
      <BooleanControl>{renderProps}</BooleanControl>,
    )

    const viaHook = renderInField(<NativeHookControl />)

    expect(viaHook).toBe(viaComponent)
  })

  test('PRD-008 renders the same custom markup as BooleanControl', () => {
    const viaComponent = renderInField(
      <BooleanControl {...CUSTOM_ROOT}>{renderProps}</BooleanControl>,
    )

    const viaHook = renderInField(<CustomHookControl />)

    expect(viaHook).toBe(viaComponent)
  })
})

function NativeHookControl() {
  return renderProps(useBooleanControl())
}

function CustomHookControl() {
  return renderProps(useBooleanControl(CUSTOM_ROOT))
}

// Handlers serialise to nothing, so only attributes are compared.
function renderProps(result: object): ReactNode {
  return <pre>{JSON.stringify(result)}</pre>
}

function renderInField(control: ReactNode): string {
  return renderToString(
    <FieldRoot
      isReadOnly
      isRequired
      label="Parity field"
      name="parity-field"
    >
      {control}
    </FieldRoot>,
  )
}
