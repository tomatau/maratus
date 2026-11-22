import {
  FIRST_ITEM,
  VALUE_MISSING_MESSAGE,
  mountCustomItems,
  reportValueMissing,
} from './customItemsField'

describe('ChoicesControl listbox mode', () => {
  it('REQ-013 exposes a multi-select listbox', () => {
    mountCustomItems({ mode: 'listbox' })

    cy.getByTestId('control')
      .should('have.attr', 'role', 'listbox')
      .and('have.attr', 'aria-multiselectable', 'true')
  })

  it('REQ-005 marks a required listbox', () => {
    mountCustomItems({ fieldState: { isRequired: true }, mode: 'listbox' })

    cy.getByTestId('control').should('have.attr', 'aria-required', 'true')
  })

  it('REQ-035 sets aria-readonly on the listbox', () => {
    mountCustomItems({ fieldState: { isReadOnly: true }, mode: 'listbox' })

    cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
  })

  describe('errors', () => {
    beforeEach(() => {
      reportValueMissing('listbox')
    })

    it('REQ-032 REQ-037 REQ-038 exposes a consumer-reported error on the listbox', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
    })

    it('REQ-032 REQ-041 clears the error once an option is selected', () => {
      cy.getByTestId(FIRST_ITEM).click()

      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })
})
