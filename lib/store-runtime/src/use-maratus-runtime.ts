import { createMaratusRuntime } from './create-runtime'

const defaultRuntime = createMaratusRuntime()

export function useMaratusRuntime() {
  return defaultRuntime
}
