import type { ComponentPropsWithRef, KeyboardEventHandler } from 'react'
import { useIsFocusVisible } from '@maratus-lib/focus-modality'
import clsx from 'clsx'
import styles from './Link.module.css'

export type LinkBaseProps = ComponentPropsWithRef<'a'> & {
  isLoading?: boolean
}

export type UseLinkProps = LinkBaseProps & {
  isNative?: boolean
}

type LinkRootProps = LinkBaseProps & {
  'data-focus-visible'?: ''
  'data-loading'?: ''
}

export type UseLinkResult = {
  linkProps: LinkRootProps
}

export function useLink(props: UseLinkProps): UseLinkResult {
  const {
    className,
    isLoading = false,
    isNative = true,
    onKeyDown,
    tabIndex,
    ...rest
  } = props
  const isFocusVisible = useIsFocusVisible()

  return {
    linkProps: {
      ...rest,
      className: clsx(styles.link, className),
      'data-focus-visible': isFocusVisible ? '' : undefined,
      'data-loading': isLoading ? '' : undefined,
      ...getRootSemanticsProps({ isNative, tabIndex }),
      onKeyDown: getKeyboardActivationHandler({ isNative, onKeyDown }),
    },
  }
}

type RootSemanticsProps = Pick<LinkRootProps, 'role' | 'tabIndex'>

function getRootSemanticsProps({
  isNative,
  tabIndex,
}: {
  isNative: boolean
  tabIndex?: number
}): RootSemanticsProps {
  if (isNative) {
    return {
      tabIndex,
    }
  }

  return {
    role: 'link',
    tabIndex: tabIndex ?? 0,
  }
}

function getKeyboardActivationHandler({
  isNative,
  onKeyDown,
}: {
  isNative: boolean
  onKeyDown?: KeyboardEventHandler<HTMLAnchorElement>
}): KeyboardEventHandler<HTMLAnchorElement> | undefined {
  if (isNative) {
    return onKeyDown
  }

  return (event) => {
    onKeyDown?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.click()
    }
  }
}
