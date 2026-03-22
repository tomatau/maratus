import { useSyncExternalStore } from 'react'

export type ArachneStore<TState> = {
  getState(): TState
  subscribe(listener: () => void): () => void
}

export type WritableArachneStore<TState> = ArachneStore<TState> & {
  setState(nextState: TState): void
}

export type ArachneRuntime = {
  getStore<TStore>(key: symbol, createStore: () => TStore): TStore
}

export function createArachneRuntime(): ArachneRuntime {
  const stores = new Map<symbol, unknown>()

  return {
    getStore<TStore>(key: symbol, createStore: () => TStore): TStore {
      const existingStore = stores.get(key) as TStore | undefined

      if (existingStore) {
        return existingStore
      }

      const nextStore = createStore()
      stores.set(key, nextStore)
      return nextStore
    },
  }
}

const defaultRuntime = createArachneRuntime()

export function useArachneRuntime() {
  return defaultRuntime
}

export function useStoreSelector<TState, TSelected>(
  store: ArachneStore<TState>,
  selector: (state: TState) => TSelected,
) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  )
}

export function createStore<TState>(
  initialState: TState,
): WritableArachneStore<TState> {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState() {
      return state
    },
    setState(nextState) {
      state = nextState

      for (const listener of listeners) {
        listener()
      }
    },
    subscribe(listener) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}
