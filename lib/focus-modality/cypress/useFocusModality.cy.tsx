import { useStoreRuntime } from '@maratus-lib/store-runtime'
import { useFocusModality } from '../src'

function Probe() {
  const modality = useFocusModality()

  return <output>{String(modality)}</output>
}

function MultipleProbes() {
  return (
    <>
      <Probe />
      <Probe />
    </>
  )
}

describe('useFocusModality', () => {
  beforeEach(() => {
    useStoreRuntime().reset()
  })

  it('PRD-001 exposes useFocusModality() for reading the current global modality', () => {
    cy.mount(<Probe />)

    cy.get('output').should('have.text', 'null')
  })

  it('REQ-001 keyboard interaction switches the global focus modality to keyboard', () => {
    cy.mount(<Probe />)

    cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

    cy.get('output').should('have.text', 'keyboard')
  })

  it('REQ-002 pointer interaction switches the global focus modality to pointer', () => {
    cy.mount(<Probe />)

    cy.get('body').realMouseDown({ position: 'topLeft' })

    cy.get('output').should('have.text', 'pointer')
  })

  it('NFR-001 multiple consumers attach one shared document listener set per runtime', () => {
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
