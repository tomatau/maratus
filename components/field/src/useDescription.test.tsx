import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { Description, FieldRoot } from './Field'
import { useDescription } from './useDescription'

const DESCRIPTION_OPTIONS = { className: 'parity-description' }

describe(useDescription, () => {
  test('PRD-024 renders the same description as Description', () => {
    const viaComponent = renderInField(<Description {...DESCRIPTION_OPTIONS} />)

    const viaHook = renderInField(<HookDescription />)

    expect(viaHook).toBe(viaComponent)
  })
})

function HookDescription() {
  const { descriptionProps } = useDescription(DESCRIPTION_OPTIONS)

  return <div {...descriptionProps} />
}

function renderInField(description: ReactNode): string {
  return renderToString(
    <FieldRoot
      description="Parity description."
      label="Parity field"
      name="parity-field"
    >
      {description}
    </FieldRoot>,
  )
}
