import type { Ref, RefCallback } from 'react'

// Lets one element take several refs, such as a consumer ref and a
// library-owned ref.
export function mergeRefs<TElement>(
  ...refs: readonly (Ref<TElement> | undefined)[]
): RefCallback<TElement> {
  return (element) => {
    const cleanups = refs.map((ref) => attachRef(ref, element))

    return () => {
      for (const cleanup of cleanups) cleanup()
    }
  }
}

function attachRef<TElement>(
  ref: Ref<TElement> | undefined,
  element: TElement | null,
): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(element)
    return typeof cleanup === 'function' ? cleanup : () => ref(null)
  }
  if (!ref) return () => {}

  ref.current = element
  return () => {
    ref.current = null
  }
}
