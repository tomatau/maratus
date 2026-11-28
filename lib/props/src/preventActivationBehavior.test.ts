import type { MouseEvent } from 'react'
import { describe, expect, mock, test } from 'bun:test'
import { preventActivationBehavior } from './index'

function createClickEvent() {
  return { preventDefault: mock() } as unknown as MouseEvent<never>
}

describe(preventActivationBehavior, () => {
  test('PRD-012 calls onClick, then cancels the activation behaviour, when prevented', () => {
    const calls: string[] = []
    const event = createClickEvent()
    const onClick = mock(() => calls.push('onClick'))
    event.preventDefault = mock(() => calls.push('preventDefault'))

    preventActivationBehavior({ onClick }, true).onClick?.(event)

    expect(onClick).toHaveBeenCalledWith(event)
    expect(calls).toEqual(['onClick', 'preventDefault'])
  })

  test('PRD-012 cancels the activation behaviour without an onClick when prevented', () => {
    const event = createClickEvent()

    preventActivationBehavior({}, true).onClick?.(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  test('PRD-013 replaces onChange with a handler that does nothing when prevented', () => {
    const onChange = mock()

    const props = preventActivationBehavior({ onChange }, true)

    expect(props.onChange).not.toBe(onChange)
    expect(() => (props.onChange as () => void)()).not.toThrow()
    expect(onChange).not.toHaveBeenCalled()
  })

  test('PRD-014 returns the same props object when not prevented', () => {
    const props = { onChange: mock(), onClick: mock() }

    expect(preventActivationBehavior(props, false)).toBe(props)
  })
})
