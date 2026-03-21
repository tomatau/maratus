import { afterEach, describe, expect, test } from 'bun:test'
import { cleanup, renderHook } from '@testing-library/react'
import { useButton } from './useButton'

afterEach(() => {
  cleanup()
})

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
})
