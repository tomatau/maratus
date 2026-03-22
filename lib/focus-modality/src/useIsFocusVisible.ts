import { useFocusModality } from './useFocusModality'

export function useIsFocusVisible() {
  return useFocusModality() === 'keyboard'
}
