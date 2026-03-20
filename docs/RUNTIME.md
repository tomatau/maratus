# Runtime

## Decisions

- A shared runtime coordinates domain stores.
- The runtime is a singleton by default.
- A provider override may be added later.
- Domain stores are resolved lazily.
- Packages own their store keys and factories.
- Local instance ids are hook-owned by default.
- Selector hooks are the subscription surface.
- Store state must be safe to read during SSR.
- Initial store state must be deterministic for the environment.

## Contracts

```ts
export type ArachneStore<TState> = {
  getState(): TState
  subscribe(listener: () => void): () => void
}
```

```ts
export type ArachneRuntime = {
  getStore<TStore>(
    key: symbol,
    createStore: () => TStore,
  ): TStore
}
```

```ts
export function useArachneRuntime(): ArachneRuntime
```

```ts
export function useStoreSelector<TState, TSelected>(
  store: ArachneStore<TState>,
  selector: (state: TState) => TSelected,
  isEqual?: (a: TSelected, b: TSelected) => boolean,
): TSelected
```

## Example

```ts
const focusModalityStoreKey = Symbol('focus-modality')

function useFocusModalityStore() {
  const runtime = useArachneRuntime()

  return runtime.getStore(
    focusModalityStoreKey,
    createFocusModalityStore,
  )
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

  return useStoreSelector(
    store,
    (state) => state.value,
  )
}
```

## SSR

`useStoreSelector` should be implemented on top of `useSyncExternalStore`.

Server snapshot reads from `selector(store.getState())`.
```
