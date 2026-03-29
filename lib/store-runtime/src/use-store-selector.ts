import type { ArachneStore, ArachneStoreValue } from './types'
import { useSyncExternalStore } from 'react'

export function useStoreSelector<
  TState extends Record<string, ArachneStoreValue>,
  TKey extends keyof TState,
>(store: ArachneStore<TState>, key: TKey) {
  return useSyncExternalStore(
    (listener) => store.subscribeKey(key, listener),
    () => store.get(key),
    () => store.get(key),
  )
}
