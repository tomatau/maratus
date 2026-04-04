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

export type MaratusStore<
  TState extends Record<string, MaratusStoreValue>,
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
}

export type WritableMaratusStore<
  TState extends Record<string, MaratusStoreValue>,
> = MaratusStore<TState>

export type MaratusRuntime = {
  getStore<TStore>(key: symbol, createStore: () => TStore): TStore
}
