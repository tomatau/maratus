import type { AnyMaratusStore, MaratusStoreRuntime } from './types'

export function createStoreRuntime(): MaratusStoreRuntime {
  const stores = new Map<symbol, AnyMaratusStore>()

  return {
    getStore<TStore extends AnyMaratusStore>(
      key: symbol,
      createStore: () => TStore,
    ): TStore {
      const existingStore = stores.get(key)

      if (existingStore) {
        return existingStore as TStore
      }

      const nextStore = createStore()
      stores.set(key, nextStore)
      return nextStore
    },
    reset() {
      for (const store of stores.values()) {
        store.dispose?.()
      }

      stores.clear()
    },
  }
}
