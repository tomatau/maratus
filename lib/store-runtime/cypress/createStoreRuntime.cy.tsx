import { createStore, createStoreRuntime } from '../src'

const runtimeStoreKey = Symbol('runtime-store')

describe('createStoreRuntime', () => {
  it('PRD-005 distinct runtimes do not share the same store instance for the same key', () => {
    const firstRuntime = createStoreRuntime()
    const secondRuntime = createStoreRuntime()

    const firstStore = firstRuntime.getStore(runtimeStoreKey, () =>
      createStore({ value: 0 }),
    )
    const secondStore = secondRuntime.getStore(runtimeStoreKey, () =>
      createStore({ value: 0 }),
    )

    expect(firstStore).not.to.equal(secondStore)
  })

  it('PRD-005 reset clears cached stores so the next lookup creates a new store', () => {
    const runtime = createStoreRuntime()

    const firstStore = runtime.getStore(runtimeStoreKey, () =>
      createStore({ value: 0 }),
    )

    runtime.reset()

    const secondStore = runtime.getStore(runtimeStoreKey, () =>
      createStore({ value: 0 }),
    )

    expect(firstStore).not.to.equal(secondStore)
  })

  it('PRD-005 reset disposes cached stores before clearing them', () => {
    const runtime = createStoreRuntime()
    const dispose = cy.stub().as('dispose')

    runtime.getStore(runtimeStoreKey, () => ({
      ...createStore({ value: 0 }),
      dispose,
    }))

    runtime.reset()

    cy.get('@dispose').should('have.been.calledOnce')
  })
})
