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
        isLoading: true,
        isPressed: true,
      }),
    )

    expect(result.current.buttonProps['aria-busy']).toBe(true)
    expect(result.current.buttonProps['aria-disabled']).toBe(true)
    expect(result.current.buttonProps['aria-pressed']).toBe(true)
    expect(result.current.buttonProps['data-loading']).toBe('')
    expect(result.current.buttonProps['data-pressed']).toBe('')
  })

  test('preserves user-supplied aria props when state does not override them', () => {
    const { result } = renderHook(() =>
      useButton({
        children: 'Save',
        isLoading: true,
        disabled: true,
        'aria-busy': 'false',
        'aria-disabled': 'false',
        'aria-pressed': 'mixed',
      }),
    )

    expect(result.current.buttonProps['aria-pressed']).toBe('mixed')
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
