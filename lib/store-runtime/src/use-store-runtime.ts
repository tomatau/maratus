import { createStoreRuntime } from './create-store-runtime'

const defaultRuntime = createStoreRuntime()

export function useStoreRuntime() {
  return defaultRuntime
}
