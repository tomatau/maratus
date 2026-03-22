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

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [store])

  return useStoreSelector(store, (state) => state.modality)
}
