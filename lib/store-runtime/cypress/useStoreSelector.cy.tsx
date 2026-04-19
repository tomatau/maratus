import { useRef } from 'react'
import { createStore, useStoreSelector } from '../src'

function ValueProbe() {
  const { current: store } = useRef(
    createStore({
      selected: true,
      ignored: 0,
    }),
  )
  const selected = useStoreSelector(store, 'selected')

  return <output data-testid="selected">{String(selected)}</output>
}

function Probe() {
  const { current: store } = useRef(
    createStore({
      selected: false,
      ignored: 0,
    }),
  )
  const selected = useStoreSelector(store, 'selected')
  const renderCount = useRef(0)

  renderCount.current += 1

  return (
    <>
      <output data-testid="selected">{String(selected)}</output>
      <output data-testid="render-count">{String(renderCount.current)}</output>
      <button
        type="button"
        onClick={() => {
          store.set('ignored', (previousValue) => previousValue + 1)
        }}
      >
        Update ignored state
      </button>
    </>
  )
}

describe('useStoreSelector', () => {
  it('PRD-002 exposes useStoreSelector() as the selector-based consumption surface for reading store state through React consumers', () => {
    cy.mount(<ValueProbe />)

    cy.getByTestId('selected').should('have.text', 'true')
  })

  it('NFR-002 selector-based consumers do not re-render when an update leaves the selected value unchanged', () => {
    cy.mount(<Probe />)

    cy.getByTestId('selected').should('have.text', 'false')
    cy.getByTestId('render-count').should('have.text', '1')

    cy.contains('button', 'Update ignored state').click()

    cy.getByTestId('selected').should('have.text', 'false')
    cy.getByTestId('render-count').should('have.text', '1')
  })
})
