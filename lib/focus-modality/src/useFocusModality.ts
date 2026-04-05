import type { MaratusStore } from '@maratus/store-runtime'
import {
  createStore,
  useStoreRuntime,
  useStoreSelector,
} from '@maratus/store-runtime'

export type FocusModality = 'keyboard' | 'pointer' | null

type FocusModalityState = {
  modality: FocusModality
}

const focusModalityStoreKey = Symbol('focus-modality')

function createFocusModalityStore(): MaratusStore<FocusModalityState> {
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
  return useStoreRuntime().getStore(
    focusModalityStoreKey,
    createFocusModalityStore,
  )
}

export function useFocusModality(): FocusModality {
  const store = useFocusModalityStore()
  return useStoreSelector(store, 'modality')
}
