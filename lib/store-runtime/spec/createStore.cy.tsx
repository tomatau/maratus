import { useEffect, useRef, useState } from 'react'
import { createStore } from '../src'

function ValueProbe() {
  const { current: store } = useRef(
    createStore({
      value: 0,
    }),
  )
  const [value, setValue] = useState(store.get('value'))

  useEffect(() => store.subscribeKey('value', () => setValue(store.get('value'))), [store])

  return (
    <>
      <output data-testid="value">{String(value)}</output>
      <button
        type="button"
        onClick={() => {
          store.set('value', (previousValue) => previousValue + 1)
        }}
      >
        Increment value
      </button>
    </>
  )
}

function Probe() {
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

describe('createStore', () => {
  it('PRD-001 exposes createStore() as the low-level writable store primitive for shared runtime-backed state', () => {
    cy.mount(<ValueProbe />)

    cy.getByTestId('value').should('have.text', '0')

    cy.contains('button', 'Increment value').click()

    cy.getByTestId('value').should('have.text', '1')
  })

  it('PRD-003 keyed store subscriptions skip unchanged values and scope notifications by key', () => {
    cy.mount(<Probe />)

    cy.getByTestId('primary-value').should('have.text', '0')
    cy.getByTestId('secondary-value').should('have.text', '0')
    cy.getByTestId('primary-notifications').should('have.text', '0')
    cy.getByTestId('any-notifications').should('have.text', '0')

    cy.contains('button', 'Set unchanged primary').click()

    cy.getByTestId('primary-notifications').should('have.text', '0')
    cy.getByTestId('any-notifications').should('have.text', '0')

    cy.contains('button', 'Set changed secondary').click()

    cy.getByTestId('primary-value').should('have.text', '0')
    cy.getByTestId('secondary-value').should('have.text', '1')
    cy.getByTestId('primary-notifications').should('have.text', '0')
    cy.getByTestId('any-notifications').should('have.text', '1')

    cy.contains('button', 'Set changed primary').click()

    cy.getByTestId('primary-value').should('have.text', '1')
    cy.getByTestId('secondary-value').should('have.text', '1')
    cy.getByTestId('primary-notifications').should('have.text', '1')
    cy.getByTestId('any-notifications').should('have.text', '2')
  })
})
