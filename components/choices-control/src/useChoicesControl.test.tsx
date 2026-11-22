import type {
  ChoicesControlMode,
  UseChoicesControlResult,
} from './ChoicesControl.types'
import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { ChoicesControl } from './ChoicesControl'
import { useChoicesControl } from './useChoicesControl'

const MODES = [
  'checkbox-items',
  'checkboxes',
  'listbox',
] as const satisfies readonly ChoicesControlMode[]

const ITEM_OPTIONS = { isSelected: true, value: 'parity-item' }

describe(useChoicesControl, () => {
  for (const mode of MODES) {
    test(`PRD-010 renders the same ${mode} markup as ChoicesControl`, () => {
      const viaComponent = renderInField(
        <ChoicesControl mode={mode}>{renderProps}</ChoicesControl>,
      )

      const viaHook = renderInField(<HookControl mode={mode} />)

      expect(viaHook).toBe(viaComponent)
    })
  }
})

function HookControl(props: { mode: ChoicesControlMode }) {
  return renderProps(useChoicesControl({ mode: props.mode }))
}

function renderProps(result: UseChoicesControlResult): ReactNode {
  return <pre>{JSON.stringify(result, callItemGetters)}</pre>
}

// Handlers serialise to nothing, so item getters are called to compare them.
function callItemGetters(key: string, value: unknown): unknown {
  return typeof value === 'function' && key.startsWith('get')
    ? value(ITEM_OPTIONS)
    : value
}

function renderInField(control: ReactNode): string {
  return renderToString(
    <FieldRoot
      isRequired
      label="Parity field"
      name="parity-field"
    >
      {control}
    </FieldRoot>,
  )
}
