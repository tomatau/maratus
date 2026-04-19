export type MaratusStoreValue =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | readonly unknown[]
  | { readonly [key: string]: unknown }

export type MaratusStoreListener = () => void

export type MaratusStoreState = Record<string, MaratusStoreValue>

export type MaratusStore<
  TState extends MaratusStoreState = MaratusStoreState,
  TKey extends keyof TState = keyof TState,
> = {
  get<TKeyName extends TKey>(key: TKeyName): TState[TKeyName]

  getSnapshot(): TState

  set<TKeyName extends TKey>(
    key: TKeyName,
    value:
      | TState[TKeyName]
      | ((previousValue: TState[TKeyName]) => TState[TKeyName]),
  ): void

  subscribeAny(listener: MaratusStoreListener): () => void

  subscribeKey<TKeyName extends TKey>(
    key: TKeyName,
    listener: MaratusStoreListener,
  ): () => void

  dispose?(): void
}

export type WritableMaratusStore<TState extends MaratusStoreState> =
  MaratusStore<TState>

export type AnyMaratusStore = MaratusStore<any, any>

export type MaratusStoreRuntime = {
  getStore<TStore extends AnyMaratusStore>(
    key: symbol,
    createStore: () => TStore,
  ): TStore
  reset(): void
}
