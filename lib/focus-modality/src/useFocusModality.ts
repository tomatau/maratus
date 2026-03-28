import type { WritableArachneStore } from '@arachne/store-runtime'
import {
  createStore,
  useArachneRuntime,
  useStoreSelector,
} from '@arachne/store-runtime'

export type FocusModality = 'keyboard' | 'pointer' | null

type FocusModalityState = {
  modality: FocusModality
}

const focusModalityStoreKey = Symbol('focus-modality')

function createFocusModalityStore(): WritableArachneStore<FocusModalityState> {
  const store = createStore<FocusModalityState>({
    modality: null,
  })

  if (typeof document !== 'undefined') {
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
  }

  return store
}

function useFocusModalityStore() {
  const runtime = useArachneRuntime()

  return runtime.getStore(focusModalityStoreKey, createFocusModalityStore)
}

export function useFocusModality(): FocusModality {
  const store = useFocusModalityStore()

  return useStoreSelector(store, (state) => state.modality)
}
