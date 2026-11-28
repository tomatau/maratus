import { describe, expect, mock, test } from 'bun:test'
import { createRef } from 'react'
import * as entryPoint from './index'
import { mergeRefs } from './index'

test('PRD-001 exports the helpers from the entry point', () => {
  expect([...Object.keys(entryPoint)].sort()).toEqual([
    'mergeRefs',
    'omitPropWithWarning',
    'omitProps',
    'preventActivationBehavior',
    'suppressActivation',
  ])
})

describe(mergeRefs, () => {
  test('PRD-002 attaches the element to every ref', () => {
    const element = document.createElement('input')
    const objectRef = createRef<HTMLInputElement>()
    const callbackRef = mock()

    mergeRefs(objectRef, callbackRef)(element)

    expect(objectRef.current).toBe(element)
    expect(callbackRef).toHaveBeenCalledWith(element)
  })

  test('PRD-003 releases every ref when the element detaches', () => {
    const element = document.createElement('input')
    const objectRef = createRef<HTMLInputElement>()
    const callbackRef = mock()
    const cleanupRef = mock()
    const callbackWithCleanup = mock(() => cleanupRef)

    const detach = mergeRefs(
      objectRef,
      callbackRef,
      callbackWithCleanup,
    )(element)
    detach?.()

    expect(objectRef.current).toBe(null)
    expect(callbackRef).toHaveBeenLastCalledWith(null)
    expect(cleanupRef).toHaveBeenCalledTimes(1)
  })

  test('PRD-004 skips missing refs', () => {
    const element = document.createElement('input')
    const callbackRef = mock()

    const detach = mergeRefs(undefined, null, callbackRef)(element)
    detach?.()

    expect(callbackRef.mock.calls).toEqual([[element], [null]])
  })
})
