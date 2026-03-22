import { useFocusModality } from '../src'

export function FocusModalityProbe() {
  const modality = useFocusModality()

  return <output>{String(modality)}</output>
}
