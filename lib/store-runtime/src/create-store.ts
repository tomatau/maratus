import type { WritableArachneStore } from './types'

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
