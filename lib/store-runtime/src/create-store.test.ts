import { describe, expect, it } from 'bun:test'
import { createStore } from './create-store'

describe(createStore, () => {
  it('PRD-003 skips notifications when a keyed value is unchanged', () => {
    const store = createStore({
      value: 0,
    })
    let notificationCount = 0

    store.subscribeKey('value', () => {
      notificationCount += 1
    })

    store.set('value', 0)

    expect(notificationCount).toBe(0)
  })
})
