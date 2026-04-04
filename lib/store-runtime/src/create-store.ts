import type {
  MaratusStoreListener,
  MaratusStoreValue,
  WritableMaratusStore,
} from './types'

export function createStore<TState extends Record<string, MaratusStoreValue>>(
  initialState: TState,
): WritableMaratusStore<TState> {
  let state = initialState
  const anyListeners = new Set<MaratusStoreListener>()
  const keyListeners = new Map<keyof TState, Set<MaratusStoreListener>>()

  return {
    get(key) {
      return state[key]
    },
    getSnapshot() {
      return state
    },
    set(key, value) {
      const previousValue = state[key]
      const nextValue = resolveNextValue(previousValue, value)
      if (Object.is(previousValue, nextValue)) {
        return
      }

      state = {
        ...state,
        [key]: nextValue,
      }

      const listenersForKey = keyListeners.get(key)
      if (listenersForKey) {
        for (const listener of listenersForKey) {
          listener()
        }
      }

      for (const listener of anyListeners) {
        listener()
      }
    },
    subscribeAny(listener) {
      anyListeners.add(listener)

      return () => {
        anyListeners.delete(listener)
      }
    },
    subscribeKey(key, listener) {
      const listenersForKey =
        keyListeners.get(key) ?? new Set<MaratusStoreListener>()
      listenersForKey.add(listener)
      keyListeners.set(key, listenersForKey)

      return () => {
        listenersForKey.delete(listener)
        if (listenersForKey.size === 0) {
          keyListeners.delete(key)
        }
      }
    },
  }
}

function resolveNextValue<TValue extends MaratusStoreValue>(
  previousValue: TValue,
  value: TValue | ((previousValue: TValue) => TValue),
): TValue {
  if (typeof value === 'function') {
    return value(previousValue)
  }

  return value
}
