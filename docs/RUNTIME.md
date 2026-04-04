# Runtime

## Decisions

- A shared runtime coordinates domain stores.
- The runtime is a singleton by default.
- We may add a provider override later.
- Resolve domain stores lazily.
- Packages own their store keys and factories.
- Local instance ids are hook-owned by default.
- Selector hooks are the subscription surface.
- Keep store state safe to read during SSR.
- Keep initial store state deterministic for the environment.

## Contracts

```ts
export type MaratusStore<TState> = {
  getState(): TState
  subscribe(listener: () => void): () => void
}
```

```ts
export type MaratusRuntime = {
  getStore<TStore>(key: symbol, createStore: () => TStore): TStore
}
```

```ts
export function useMaratusRuntime(): MaratusRuntime
```

```ts
export function useStoreSelector<TState, TSelected>(
  store: MaratusStore<TState>,
  selector: (state: TState) => TSelected,
  isEqual?: (a: TSelected, b: TSelected) => boolean,
): TSelected
```

## Example

```ts
const focusModalityStoreKey = Symbol('focus-modality')

function useFocusModalityStore() {
  const runtime = useMaratusRuntime()

  return runtime.getStore(focusModalityStoreKey, createFocusModalityStore)
}
```

```ts
function useFocusScope() {
  const store = useFocusScopeStore()
  const instanceId = useRef(Symbol('focusScope'))

  useEffect(() => {
    return store.register(instanceId.current)
  }, [store])
}
```

```ts
function useSomething() {
  const store = useSomethingStore()

  return useStoreSelector(store, (state) => state.value)
}
```

## SSR

Implement `useStoreSelector` on top of `useSyncExternalStore`.

Read the server snapshot from `selector(store.getState())`.
