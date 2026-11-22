// Copies the way object spread does: own enumerable string and symbol keys,
// with every value kept by reference, so functions, arrays, objects, and
// refs stay the same instances.
export function omitProps<TProps extends object, TKey extends PropertyKey>(
  props: TProps,
  keys: readonly TKey[],
): Omit<TProps, TKey> {
  const omittedKeys = new Set<PropertyKey>(keys.map(toPropertyKey))
  const remainingProps: Record<PropertyKey, unknown> = {}

  for (const key of Reflect.ownKeys(props)) {
    if (omittedKeys.has(key) || !isEnumerable(props, key)) continue
    remainingProps[key] = Reflect.get(props, key)
  }

  return remainingProps as Omit<TProps, TKey>
}

// Object keys are strings or symbols, so a numeric key matches its string.
function toPropertyKey(key: PropertyKey): string | symbol {
  return typeof key === 'number' ? String(key) : key
}

function isEnumerable(props: object, key: PropertyKey): boolean {
  return Object.prototype.propertyIsEnumerable.call(props, key)
}
