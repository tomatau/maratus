import { warnInDevelopment } from '@maratus-lib/development'
import { omitProps } from './omitProps'

// For a prop a component cannot honour: it is removed, and in development
// the consumer is told why.
export function omitPropWithWarning<TProps extends object, TKey extends string>(
  props: TProps,
  key: TKey,
  message: string,
): Omit<TProps, TKey> {
  if (!(key in props)) return props

  warnInDevelopment(message)

  return omitProps(props, [key])
}
