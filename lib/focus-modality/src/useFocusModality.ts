import type { ArachneStore } from '@arachne/store-runtime'
import { createStore, useArachneRuntime } from '@arachne/store-runtime'
import { useSyncExternalStore } from 'react'

export type FocusModality = 'keyboard' | 'pointer' | null

type FocusModalityState = {
  modality: FocusModality
}

const focusModalityStoreKey = Symbol('focus-modality')

function createFocusModalityStore(): ArachneStore<FocusModalityState> {
  const store = createStore<FocusModalityState>({
    modality: null,
  })

  if (typeof document !== 'undefined') {
    const handleKeyDown = () => store.set('modality', 'keyboard')
    const handlePointerDown = () => store.set('modality', 'pointer')

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
  }

  return store
}

function useFocusModalityStore() {
  return useArachneRuntime().getStore(
    focusModalityStoreKey,
    createFocusModalityStore,
  )
}

export function useFocusModality(): FocusModality {
  const store = useFocusModalityStore()

  return useSyncExternalStore(
    (listener) => store.subscribeKey('modality', listener),
    () => store.get('modality'),
    () => store.get('modality'),
  )
}
