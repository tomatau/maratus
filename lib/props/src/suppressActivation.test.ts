import type { KeyboardEvent } from 'react'
import { describe, expect, mock, test } from 'bun:test'
import { suppressActivation } from './index'

function createKeyEvent(key: string) {
  return { key, preventDefault: mock() } as unknown as KeyboardEvent<never>
}

describe(suppressActivation, () => {
  test('PRD-009 drops pointer activation handlers when suppressed', () => {
    const itemProps = { onClick: mock(), onPointerDown: mock(), title: 'Item' }

    const props: object = suppressActivation(itemProps, true)

    expect(props).toEqual({ title: 'Item' })
  })

  for (const key of ['Enter', ' ']) {
    test(`PRD-010 skips "${key}" in key handlers and prevents its default when suppressed`, () => {
      const onKeyDown = mock()
      const props = suppressActivation({ onKeyDown }, true)
      const event = createKeyEvent(key)

      props.onKeyDown?.(event)

      expect(onKeyDown).not.toHaveBeenCalled()
      expect(event.preventDefault).toHaveBeenCalled()
    })
  }

  test('PRD-010 passes other keys to key handlers when suppressed', () => {
    const onKeyDown = mock()
    const props = suppressActivation({ onKeyDown }, true)
    const event = createKeyEvent('ArrowDown')

    props.onKeyDown?.(event)

    expect(onKeyDown).toHaveBeenCalledWith(event)
  })

  test('PRD-011 returns the props unchanged when not suppressed', () => {
    const props = { onClick: mock() }

    expect(suppressActivation(props, false)).toBe(props)
  })
})
