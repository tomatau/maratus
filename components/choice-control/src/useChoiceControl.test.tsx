import type {
  ChoiceControlMode,
  UseChoiceControlResult,
} from './ChoiceControl.types'
import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { ChoiceControl } from './ChoiceControl'
import { useChoiceControl } from './useChoiceControl'

const MODES = [
  'listbox',
  'radio-items',
  'radios',
  'select',
] as const satisfies readonly ChoiceControlMode[]

const ITEM_OPTIONS = { isSelected: true, value: 'parity-item' }

describe(useChoiceControl, () => {
  for (const mode of MODES) {
    test(`PRD-010 renders the same ${mode} markup as ChoiceControl`, () => {
      const viaComponent = renderInField(
        <ChoiceControl mode={mode}>{renderProps}</ChoiceControl>,
      )

      const viaHook = renderInField(<HookControl mode={mode} />)

      expect(viaHook).toBe(viaComponent)
    })
  }
})

function HookControl(props: { mode: ChoiceControlMode }) {
  return renderProps(useChoiceControl({ mode: props.mode }))
}

function renderProps(result: UseChoiceControlResult): ReactNode {
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
