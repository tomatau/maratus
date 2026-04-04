import type { MaratusStore, MaratusStoreValue } from './types'
import { useSyncExternalStore } from 'react'

export function useStoreSelector<
  TState extends Record<string, MaratusStoreValue>,
  TKey extends keyof TState,
>(store: MaratusStore<TState>, key: TKey) {
  return useSyncExternalStore(
    (listener) => store.subscribeKey(key, listener),
    () => store.get(key),
    () => store.get(key),
  )
}
