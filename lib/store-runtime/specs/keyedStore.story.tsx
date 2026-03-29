import { useEffect, useRef, useState } from 'react'
import { createStore } from '../src'

export function KeyedStoreProbe() {
  const { current: store } = useRef(
    createStore({
      primary: 0,
      secondary: 0,
    }),
  )
  const [primaryNotifications, setPrimaryNotifications] = useState(0)
  const [anyNotifications, setAnyNotifications] = useState(0)

  useEffect(() => {
    const unsubscribePrimary = store.subscribeKey('primary', () => {
      setPrimaryNotifications((count) => count + 1)
    })
    const unsubscribeAny = store.subscribeAny(() => {
      setAnyNotifications((count) => count + 1)
    })

    return () => {
      unsubscribePrimary()
      unsubscribeAny()
    }
  }, [store])

  return (
    <>
      <output data-testid="primary-value">
        {String(store.get('primary'))}
      </output>
      <output data-testid="secondary-value">
        {String(store.get('secondary'))}
      </output>
      <output data-testid="primary-notifications">
        {String(primaryNotifications)}
      </output>
      <output data-testid="any-notifications">
        {String(anyNotifications)}
      </output>
      <button
        type="button"
        onClick={() => {
          store.set('primary', store.get('primary'))
        }}
      >
        Set unchanged primary
      </button>
      <button
        type="button"
        onClick={() => {
          store.set('secondary', (previousValue) => previousValue + 1)
        }}
      >
        Set changed secondary
      </button>
      <button
        type="button"
        onClick={() => {
          store.set('primary', (previousValue) => previousValue + 1)
        }}
      >
        Set changed primary
      </button>
    </>
  )
}
