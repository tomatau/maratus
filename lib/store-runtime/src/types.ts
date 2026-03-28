export type ArachneStore<TState> = {
  getState(): TState
  subscribe(listener: () => void): () => void
}

export type WritableArachneStore<TState> = ArachneStore<TState> & {
  setState(nextState: TState): void
}

export type ArachneRuntime = {
  getStore<TStore>(key: symbol, createStore: () => TStore): TStore
}
