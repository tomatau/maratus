import { mount } from 'cypress/react'
import 'cypress-axe'
import 'cypress-real-events'

const CYPRESS_ROOT = '[data-cy-root]'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('injectAxeAtRoot', () => {
  cy.injectAxe({ axeCorePath: Cypress.expose('axeCorePath') })
})

Cypress.Commands.add('auditA11y', (subject = CYPRESS_ROOT) => {
  cy.checkA11y(subject)
})

Cypress.Commands.add('getByTestId', (testId, options) =>
  cy.get(`[data-testid="${testId}"]`, options),
)

Cypress.Commands.add('getRootElement', () =>
  cy.get(CYPRESS_ROOT, { log: false }).then(($root) =>
    cy
      .wrap($root, { log: false })
      .children({ log: false })
      .then(($el) => {
        Cypress.log({
          name: 'getRootElement',
          $el,
          message: 'Element rendered at root',
        })

        return $el
      }),
  ),
)
