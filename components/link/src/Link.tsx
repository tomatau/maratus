import type { LinkBaseProps } from './useLink'
import type { ElementType } from 'react'
import { useLink } from './useLink'

export type LinkProps = LinkBaseProps & {
  as?: ElementType
}

export function Link(props: LinkProps) {
  const { as, ...rest } = props
  const Root = as ?? 'a'
  const { linkProps } = useLink({
    ...rest,
    mode: Root === 'a' ? 'native' : 'custom',
  })

  return <Root {...linkProps} />
}
