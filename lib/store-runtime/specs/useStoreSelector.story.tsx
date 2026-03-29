import { useRef } from 'react'
import { createStore, useStoreSelector } from '../src'

export function StoreSelectorRenderProbe() {
  const { current: store } = useRef(
    createStore({
      selected: false,
      ignored: 0,
    }),
  )
  const selected = useStoreSelector(store, 'selected')
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <>
      <output data-testid="selected">{String(selected)}</output>
      <output data-testid="render-count">{String(renderCount.current)}</output>
      <button
        type="button"
        onClick={() => {
          store.set('ignored', (previousValue) => previousValue + 1)
        }}
      >
        Update ignored state
      </button>
    </>
  )
}
