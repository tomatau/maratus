import { useStoreRuntime } from '@maratus-lib/store-runtime'
import { useIsFocusVisible } from '../src'

function Probe() {
  const isFocusVisible = useIsFocusVisible()

  return <output>{String(isFocusVisible)}</output>
}

function MultipleProbes() {
  return (
    <>
      <Probe />
      <Probe />
    </>
  )
}

describe('useIsFocusVisible', () => {
  beforeEach(() => {
    useStoreRuntime().reset()
  })

  it('PRD-002 exposes useIsFocusVisible() for reading the current global focus-visible state', () => {
    cy.mount(<Probe />)

    cy.get('output').should('have.text', 'false')
  })

  it('REQ-003 PRD-003 keyboard modality makes global focus-visible state true', () => {
    cy.mount(<Probe />)

    cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

    cy.get('output').should('have.text', 'true')
  })

  it('REQ-004 pointer modality makes global focus-visible state false', () => {
    cy.mount(<Probe />)

    cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)
    cy.get('output').should('have.text', 'true')

    cy.get('body').realMouseDown({ position: 'topLeft' })

    cy.get('output').should('have.text', 'false')
  })

  it('NFR-001 multiple focus-visible consumers attach one shared document listener set per runtime', () => {
    const addEventListenerSpy = Cypress.sinon.spy(
      EventTarget.prototype,
      'addEventListener',
    )

    cy.mount(<MultipleProbes />)

    cy.wrap(null, { log: false }).should(() => {
      const eventTypes = addEventListenerSpy
        .getCalls()
        .filter((call) => call.thisValue === document)
        .map((call) => call.args[0])

      expect(eventTypes.filter((type) => type === 'keydown')).to.have.length(1)
      expect(
        eventTypes.filter((type) => type === 'pointerdown'),
      ).to.have.length(1)
    })
  })
})
