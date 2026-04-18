import { Button } from '../src'

describe('Button', () => {
  it('REQ-001 REQ-002 PRD-003 button renders native button semantics and has no automatic axe violations', () => {
    cy.mount(<Button>Press me</Button>)

    cy.get('button').should('have.text', 'Press me')

    cy.injectAxeAtRoot()
    cy.auditA11y()
  })
})
