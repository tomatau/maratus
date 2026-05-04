import type {
  ComponentPropsWithRef,
  KeyboardEventHandler,
  MouseEventHandler,
} from 'react'
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
    onClick,
    onKeyDown,
    tabIndex,
    ...rest
  } = props
  const isFocusVisible = useIsFocusVisible()

  return {
    linkProps: {
      ...rest,
      className: clsx(styles.link, className),
      'aria-busy': isLoading ? true : undefined,
      'aria-disabled': isLoading ? true : undefined,
      'data-focus-visible': isFocusVisible ? '' : undefined,
      'data-loading': isLoading ? '' : undefined,
      ...getRootSemanticsProps({ isNative, tabIndex }),
      onClick: getClickHandler({ isLoading, onClick }),
      onKeyDown: getKeyboardActivationHandler({
        isLoading,
        isNative,
        onKeyDown,
      }),
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
  isLoading,
  isNative,
  onKeyDown,
}: {
  isLoading: boolean
  isNative: boolean
  onKeyDown?: KeyboardEventHandler<HTMLAnchorElement>
}): KeyboardEventHandler<HTMLAnchorElement> | undefined {
  return (event) => {
    onKeyDown?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (isLoading) {
      event.preventDefault()
      return
    }

    if (isNative) {
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      event.currentTarget.click()
    }
  }
}

function getClickHandler({
  isLoading,
  onClick,
}: {
  isLoading: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}): MouseEventHandler<HTMLAnchorElement> | undefined {
  return (event) => {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (isLoading) {
      event.preventDefault()
    }
  }
}
