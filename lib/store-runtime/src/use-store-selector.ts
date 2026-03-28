import type { ArachneStore } from './types'
import { useSyncExternalStore } from 'react'

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
