import { mount } from 'cypress/react'
import 'cypress-axe'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('injectAxeAtRoot', () => {
  cy.injectAxe({ axeCorePath: Cypress.expose('axeCorePath') })
})

Cypress.Commands.add('auditA11y', (subject = '[data-cy-root]') => {
  cy.checkA11y(subject)
})
