import type { KeyboardEvent } from 'react'
import { afterEach, describe, expect, test } from 'bun:test'
import { cleanup, renderHook } from '@testing-library/react'
import { useButton } from './useButton'

afterEach(() => {
  cleanup()
})

function createKeyboardEvent(
  key: string,
  options: {
    currentTarget?: Pick<HTMLButtonElement, 'click'>
    preventDefault?: () => void
  } = {},
) {
  return {
    currentTarget: options.currentTarget ?? {
      click: () => undefined,
    },
    key,
    preventDefault: options.preventDefault ?? (() => undefined),
  } as unknown as KeyboardEvent<HTMLButtonElement>
}

describe(useButton, () => {
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

  test('omits pointer activation handlers when interaction is disabled', () => {
    const onClick = () => undefined
    const onMouseDown = () => undefined

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        onClick,
        onMouseDown,
      }),
    )

    expect(result.current.buttonProps.onClick).toBeUndefined()
    expect(result.current.buttonProps.onMouseDown).toBeUndefined()
  })

  test('preserves pointer activation handlers when interaction is enabled', () => {
    const onClick = () => undefined

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        onClick,
      }),
    )

    expect(result.current.buttonProps.onClick).toBe(onClick)
  })

  test('preserves keyboard handlers when enabled', () => {
    let keyDownCalls = 0
    let keyUpCalls = 0

    const onKeyDown = () => {
      keyDownCalls += 1
    }
    const onKeyUp = () => {
      keyUpCalls += 1
    }
    const { result: handlersResult } = renderHook(() =>
      useButton({
        children: 'Save',
        onKeyDown,
        onKeyUp,
      }),
    )

    handlersResult.current.buttonProps.onKeyDown?.(createKeyboardEvent('Enter'))
    handlersResult.current.buttonProps.onKeyUp?.(createKeyboardEvent(' '))

    expect(keyDownCalls).toBe(1)
    expect(keyUpCalls).toBe(1)
  })

  test('blocks Enter on keydown for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let prevented = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
        onKeyDown: () => {
          keyDownCalls += 1
        },
      }),
    )

    result.current.buttonProps.onKeyDown?.(
      createKeyboardEvent('Enter', {
        preventDefault: () => {
          prevented = true
        },
      }),
    )

    expect(prevented).toBe(true)
    expect(keyDownCalls).toBe(0)
  })

  test('blocks Space on keydown and keyup for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let keyUpCalls = 0
    let preventedKeyDown = false
    let preventedKeyUp = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
        onKeyDown: () => {
          keyDownCalls += 1
        },
        onKeyUp: () => {
          keyUpCalls += 1
        },
      }),
    )

    result.current.buttonProps.onKeyDown?.(
      createKeyboardEvent(' ', {
        preventDefault: () => {
          preventedKeyDown = true
        },
      }),
    )

    result.current.buttonProps.onKeyUp?.(
      createKeyboardEvent(' ', {
        preventDefault: () => {
          preventedKeyUp = true
        },
      }),
    )

    expect(preventedKeyDown).toBe(true)
    expect(preventedKeyUp).toBe(true)
    expect(keyDownCalls).toBe(0)
    expect(keyUpCalls).toBe(0)
  })

  test('does not block non-activation keys for focusable disabled buttons', () => {
    let keyDownCalls = 0
    let prevented = false

    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
        onKeyDown: () => {
          keyDownCalls += 1
        },
      }),
    )

    result.current.buttonProps.onKeyDown?.(
      createKeyboardEvent('Tab', {
        preventDefault: () => {
          prevented = true
        },
      }),
    )

    expect(prevented).toBe(false)
    expect(keyDownCalls).toBe(1)
  })

  test('sets native disabled when native disabled behaviour applies', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
      }),
    )

    expect(result.current.buttonProps.disabled).toBe(true)
  })

  test('does not set native disabled when focusable disabled behaviour applies', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        disabled: true,
        disabledBehavior: 'focusable',
      }),
    )

    expect(result.current.buttonProps.disabled).toBe(undefined)
  })

  describe('non-native roots', () => {
    test('returns button semantics', () => {
      const { result } = renderHook(() =>
        useButton({
          children: 'Save',
          isNative: false,
        }),
      )

      expect(result.current.buttonProps.role).toBe('button')
      expect(result.current.buttonProps.tabIndex).toBe(0)
    })

    test('keeps focusable disabled roots in the tab order', () => {
      const { result } = renderHook(() =>
        useButton({
          children: 'Save',
          disabled: true,
          disabledBehavior: 'focusable',
          isNative: false,
        }),
      )

      expect(result.current.buttonProps.tabIndex).toBe(0)
      expect(result.current.buttonProps.disabled).toBe(undefined)
    })

    test('does not return native-only props', () => {
      const { result } = renderHook(() =>
        useButton({
          children: 'Save',
          disabled: true,
          isNative: false,
          type: 'submit',
        }),
      )

      expect(result.current.buttonProps.disabled).toBe(undefined)
      expect(result.current.buttonProps.type).toBe(undefined)
    })

    test('synthesises click activation for Enter and Space', () => {
      let clicks = 0

      const { result } = renderHook(() =>
        useButton({
          children: 'Save',
          isNative: false,
        }),
      )

      result.current.buttonProps.onKeyDown?.(
        createKeyboardEvent('Enter', {
          currentTarget: {
            click: () => {
              clicks += 1
            },
          },
        }),
      )

      result.current.buttonProps.onKeyUp?.(
        createKeyboardEvent(' ', {
          currentTarget: {
            click: () => {
              clicks += 1
            },
          },
        }),
      )

      expect(clicks).toBe(2)
    })

    test('calls non-native keyboard handlers once', () => {
      let keyDownCalls = 0
      let keyUpCalls = 0

      const { result } = renderHook(() =>
        useButton({
          children: 'Save',
          isNative: false,
          onKeyDown: () => {
            keyDownCalls += 1
          },
          onKeyUp: () => {
            keyUpCalls += 1
          },
        }),
      )

      result.current.buttonProps.onKeyDown?.(createKeyboardEvent('Enter'))
      result.current.buttonProps.onKeyUp?.(createKeyboardEvent(' '))

      expect(keyDownCalls).toBe(1)
      expect(keyUpCalls).toBe(1)
    })
  })
})
