import type { KeyboardEvent } from 'react'
import { afterEach, describe, expect, test } from 'bun:test'
import { cleanup, renderHook } from '@testing-library/react'
import { useButton } from './useButton'

afterEach(() => {
  cleanup()
})

function createKeyboardEvent(
  key: string,
  preventDefault: () => void = () => undefined,
) {
  return {
    key,
    preventDefault,
  } as unknown as KeyboardEvent<HTMLButtonElement>
}

describe('useButton', () => {
  test('sets aria and data state props from button state', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        kind: 'toggle',
        isLoading: true,
        pressed: true,
      }),
    )

    expect(result.current.buttonProps['aria-busy']).toBe(true)
    expect(result.current.buttonProps['aria-disabled']).toBe(true)
    expect(result.current.buttonProps['aria-pressed']).toBe(true)
    expect(result.current.buttonProps['data-loading']).toBe('')
  })

  test('does not set aria-pressed for command buttons', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
      }),
    )

    expect(result.current.buttonProps['aria-pressed']).toBeUndefined()
  })

  test('supports mixed pressed state for toggle buttons', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        kind: 'toggle',
        pressed: 'mixed',
      }),
    )

    expect(result.current.buttonProps['aria-pressed']).toBe('mixed')
  })

  test('preserves user-supplied busy and disabled aria props when state does not override them', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        isLoading: true,
        disabled: true,
        'aria-busy': 'false',
        'aria-disabled': 'false',
      }),
    )

    expect(result.current.buttonProps['aria-busy']).toBe('false')
    expect(result.current.buttonProps['aria-disabled']).toBe('false')
  })

  test('whenEnabled omits props when interaction is disabled', () => {
    const onClick = () => undefined
    const onMouseDown = () => undefined

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
      }),
    )

    expect(
      result.current.whenEnabled({
        onClick,
        onMouseDown,
      }),
    ).toEqual({})
  })

  test('whenEnabled preserves props when interaction is enabled', () => {
    const onClick = () => undefined
    const tabIndex = 0

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
      }),
    )

    expect(result.current.whenEnabled({ onClick, tabIndex })).toEqual({
      onClick,
      tabIndex,
    })
  })

  test('preventActivation preserves keyboard handlers when enabled', () => {
    let keyDownCalls = 0
    let keyUpCalls = 0

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
      }),
    )

    const handlers = result.current.preventActivation({
      onKeyDown: () => {
        keyDownCalls += 1
      },
      onKeyUp: () => {
        keyUpCalls += 1
      },
    })

    handlers.onKeyDown?.(createKeyboardEvent('Enter'))
    handlers.onKeyUp?.(createKeyboardEvent(' '))

    expect(keyDownCalls).toBe(1)
    expect(keyUpCalls).toBe(1)
  })

  test('preventActivation blocks Enter on keydown for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let prevented = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
      }),
    )

    const handlers = result.current.preventActivation({
      onKeyDown: () => {
        keyDownCalls += 1
      },
    })

    handlers.onKeyDown?.(
      createKeyboardEvent('Enter', () => {
        prevented = true
      }),
    )

    expect(prevented).toBe(true)
    expect(keyDownCalls).toBe(0)
  })

  test('preventActivation blocks Space on keydown and keyup for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let keyUpCalls = 0
    let preventedKeyDown = false
    let preventedKeyUp = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
      }),
    )

    const handlers = result.current.preventActivation({
      onKeyDown: () => {
        keyDownCalls += 1
      },
      onKeyUp: () => {
        keyUpCalls += 1
      },
    })

    handlers.onKeyDown?.(
      createKeyboardEvent(' ', () => {
        preventedKeyDown = true
      }),
    )

    handlers.onKeyUp?.(
      createKeyboardEvent(' ', () => {
        preventedKeyUp = true
      }),
    )

    expect(preventedKeyDown).toBe(true)
    expect(preventedKeyUp).toBe(true)
    expect(keyDownCalls).toBe(0)
    expect(keyUpCalls).toBe(0)
  })

  test('preventActivation does not block non-activation keys for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let prevented = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
      }),
    )

    const handlers = result.current.preventActivation({
      onKeyDown: () => {
        keyDownCalls += 1
      },
    })

    handlers.onKeyDown?.(
      createKeyboardEvent('Tab', () => {
        prevented = true
      }),
    )

    expect(prevented).toBe(false)
    expect(keyDownCalls).toBe(1)
  })
})
