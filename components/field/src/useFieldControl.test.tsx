import type { FieldControlRenderArgs } from './Field.types'
import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { FieldControl, FieldRoot } from './Field'
import { useFieldControl } from './useFieldControl'

const CONTROL_OPTIONS = { className: 'parity-control' }

describe(useFieldControl, () => {
  test('PRD-023 passes the same result to its children as FieldControl', () => {
    const viaComponent = renderInField(
      <FieldControl {...CONTROL_OPTIONS}>{renderArgs}</FieldControl>,
    )

    const viaHook = renderInField(<HookControl />)

    expect(viaHook).toBe(viaComponent)
  })
})

function HookControl() {
  return renderArgs(useFieldControl(CONTROL_OPTIONS))
}

// Handlers serialise to nothing, so this compares the prop values.
function renderArgs(args: FieldControlRenderArgs) {
  return <pre>{JSON.stringify(args)}</pre>
}

function renderInField(control: ReactNode): string {
  return renderToString(
    <FieldRoot
      description="Parity description."
      isLoading
      isRequired
      label="Parity field"
      name="parity-field"
    >
      {control}
    </FieldRoot>,
  )
}
