import type { ArachneRuntime } from './types'

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
