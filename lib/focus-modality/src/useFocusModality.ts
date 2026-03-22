import type { WritableArachneStore } from './runtime'
import { useEffect } from 'react'
import { createStore, useArachneRuntime, useStoreSelector } from './runtime'

export type FocusModality = 'keyboard' | 'pointer' | null

type FocusModalityState = {
  modality: FocusModality
}

const focusModalityStoreKey = Symbol('focus-modality')

function createFocusModalityStore(): WritableArachneStore<FocusModalityState> {
  return createStore<FocusModalityState>({
    modality: null,
  })
}

function useFocusModalityStore() {
  const runtime = useArachneRuntime()

  return runtime.getStore(focusModalityStoreKey, createFocusModalityStore)
}

export function useFocusModality(): FocusModality {
  const store = useFocusModalityStore()

  useEffect(() => {
    const handleKeyDown = () => {
      store.setState({
        modality: 'keyboard',
      })
    }

    const handlePointerDown = () => {
      store.setState({
        modality: 'pointer',
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [store])

  return useStoreSelector(store, (state) => state.modality)
}
