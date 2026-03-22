import type { ArachneStore } from './runtime'
import { createStore, useArachneRuntime, useStoreSelector } from './runtime'

export type FocusModality = 'keyboard' | 'pointer' | null

type FocusModalityState = {
  modality: FocusModality
}

const focusModalityStoreKey = Symbol('focus-modality')

function createFocusModalityStore(): ArachneStore<FocusModalityState> {
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

  return useStoreSelector(store, (state) => state.modality)
}
