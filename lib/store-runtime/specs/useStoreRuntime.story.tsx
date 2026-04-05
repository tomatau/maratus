import { useRef } from 'react'
import { createStore, useStoreRuntime, useStoreSelector } from '../src'

const runtimeStoreKey = Symbol('runtime-store')

export function StoreRuntimeProbe() {
  const runtime = useStoreRuntime()
  const { current: firstStore } = useRef(
    runtime.getStore(runtimeStoreKey, () => createStore({ value: 0 })),
  )
  const { current: secondStore } = useRef(
    runtime.getStore(runtimeStoreKey, () => createStore({ value: 0 })),
  )
  const firstValue = useStoreSelector(firstStore, 'value')
  const secondValue = useStoreSelector(secondStore, 'value')

  return (
    <>
      <output data-testid="same-instance">
        {String(firstStore === secondStore)}
      </output>
      <output data-testid="first-value">{String(firstValue)}</output>
      <output data-testid="second-value">{String(secondValue)}</output>
      <button
        type="button"
        onClick={() => {
          firstStore.set('value', 1)
        }}
      >
        Update first store
      </button>
    </>
  )
}
