export type ArachneStoreValue =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | readonly unknown[]
  | { readonly [key: string]: unknown }

export type ArachneStoreListener = () => void

export type ArachneStore<
  TState extends Record<string, ArachneStoreValue>,
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

  subscribeAny(listener: ArachneStoreListener): () => void

  subscribeKey<TKeyName extends TKey>(
    key: TKeyName,
    listener: ArachneStoreListener,
  ): () => void
}

export type WritableArachneStore<
  TState extends Record<string, ArachneStoreValue>,
> = ArachneStore<TState>

export type ArachneRuntime = {
  getStore<TStore>(key: symbol, createStore: () => TStore): TStore
}
