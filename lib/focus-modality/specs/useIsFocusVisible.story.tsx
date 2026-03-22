import { useIsFocusVisible } from '../src'

export function FocusVisibleProbe() {
  const isFocusVisible = useIsFocusVisible()

  return <output>{String(isFocusVisible)}</output>
}
