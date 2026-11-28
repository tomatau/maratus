import {
  FIRST_CHOICE,
  REQUIRED_FIRST_CHECKBOX,
  VALUE_MISSING_MESSAGE,
  mountCheckboxes,
} from './checkboxesField'

describe('ChoicesControl checkboxes mode errors', () => {
  describe('after a failed validity check', () => {
    beforeEach(() => {
      mountCheckboxes({ checkboxes: REQUIRED_FIRST_CHECKBOX })
      cy.getByTestId('form').checkFormValidity()
    })

    it('REQ-017 PRD-012 PRD-002 describes the group with a browser-detected error', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
        'error',
      ])
    })

    it('REQ-018 omits aria-invalid and aria-errormessage on the group', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })

    it('PRD-012 REQ-042 drops the error from the group once the checkbox is valid', () => {
      cy.getByTestId(FIRST_CHOICE).check()

      cy.getByTestId('error').find('p').should('have.length', 0)
      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it('REQ-017 REQ-018 has no violations with a visible error', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })
})
