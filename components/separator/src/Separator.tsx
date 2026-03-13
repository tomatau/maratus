import type { HTMLAttributes } from 'react'

export type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
  isDecorative?: boolean
}

export function Separator(props: SeparatorProps) {
  const { className, isDecorative, ...rest } = props
  const ariaHidden = isDecorative ? true : rest['aria-hidden']
  const rootClassName = className
    ? `arachne-separator ${className}`
    : 'arachne-separator'

  return (
    <hr
      {...rest}
      aria-hidden={ariaHidden}
      className={rootClassName}
    />
  )
}
