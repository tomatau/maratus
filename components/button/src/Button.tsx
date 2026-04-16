import type { ButtonProps } from './useButton'
import { useButton } from './useButton'

export function Button(props: ButtonProps) {
  const { buttonProps } = useButton(props)

  return <button {...buttonProps} />
}
