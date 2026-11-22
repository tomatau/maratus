import {
  FIRST_ITEM,
  VALUE_MISSING_MESSAGE,
  getItems,
  mountCustomItems,
  reportValueMissing,
} from './customItemsField'

describe('ChoicesControl checkbox-items mode', () => {
  it('REQ-001 contains the items in a group', () => {
    mountCustomItems({ mode: 'checkbox-items' })

    cy.getByTestId('control').should('have.attr', 'role', 'group')
  })

  it('REQ-004 PRD-008 keeps a required field off the group and its items', () => {
    mountCustomItems({
      fieldState: { isRequired: true },
      mode: 'checkbox-items',
    })

    cy.getByTestId('control').should('not.have.attr', 'aria-required')
    getItems().should('not.have.attr', 'aria-required')
  })

  describe('readonly', () => {
    beforeEach(() => {
      mountCustomItems({
        fieldState: { isReadOnly: true },
        mode: 'checkbox-items',
      })
    })

    it('REQ-024 sets aria-readonly on each item', () => {
      getItems().should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-020 omits aria-readonly on the group', () => {
      cy.getByTestId('control').should('not.have.attr', 'aria-readonly')
    })
  })

  describe('errors', () => {
    beforeEach(() => {
      reportValueMissing('checkbox-items')
    })

    it('REQ-017 REQ-032 PRD-005 describes the group with a consumer-reported error', () => {
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

    it('REQ-032 REQ-042 drops the error from the group once an item is selected', () => {
      cy.getByTestId(FIRST_ITEM).click()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })
  })
})
