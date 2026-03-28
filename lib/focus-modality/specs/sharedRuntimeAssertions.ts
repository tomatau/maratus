import { expect } from '@playwright/experimental-ct-react'

type PageLike = {
  evaluate: <T>(pageFunction: () => T | Promise<T>) => Promise<T>
}

type ListenerCounts = {
  keydownCount: number
  pointerdownCount: number
}

export async function installDocumentListenerCountProbe(page: PageLike) {
  await page.evaluate(() => {
    const originalAddEventListener = document.addEventListener.bind(document)
    let keydownCount = 0
    let pointerdownCount = 0

    document.addEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: AddEventListenerOptions | boolean,
    ) => {
      if (type === 'keydown') {
        keydownCount += 1
      }
      if (type === 'pointerdown') {
        pointerdownCount += 1
      }

      originalAddEventListener(type, listener, options)
    }) as typeof document.addEventListener

    ;(
      window as typeof window & {
        __arachneFocusModalityListenerCounts?: () => ListenerCounts
      }
    ).__arachneFocusModalityListenerCounts = () => ({
      keydownCount,
      pointerdownCount,
    })
  })
}

export async function expectOneSharedFocusModalityListenerSet(page: PageLike) {
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as typeof window & {
            __arachneFocusModalityListenerCounts: () => ListenerCounts
          }
        ).__arachneFocusModalityListenerCounts(),
      ),
    )
    .toEqual({
      keydownCount: 1,
      pointerdownCount: 1,
    })
}
