import { createArachneRuntime } from './create-runtime'

const defaultRuntime = createArachneRuntime()

export function useArachneRuntime() {
  return defaultRuntime
}
