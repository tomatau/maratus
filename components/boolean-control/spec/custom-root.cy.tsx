import type { BooleanControlRole } from '../src'
import {
  CUSTOM_CHECKBOX,
  SERVER_ERROR_MESSAGE,
  VALUE_MISSING_MESSAGE,
  mountCustomRoot,
  mountReportingCustomRoot,
} from './booleanControlField'

describe('BooleanControl custom mode', () => {
  describe('semantics', () => {
    const ROLES: readonly BooleanControlRole[] = ['checkbox', 'switch']

    ROLES.forEach((role) => {
      it(`REQ-007 PRD-002 gives the custom root role="${role}"`, () => {
        mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, role } })

        cy.getByTestId('control').should('have.attr', 'role', role)
      })
    })

    it('REQ-021 REQ-022 REQ-028 PRD-017 gives the custom root only global attributes', () => {
      const GLOBAL_ATTRIBUTE = /^(aria-.+|class|data-.+|id|role|tabindex)$/

      mountCustomRoot({
        control: { ...CUSTOM_CHECKBOX, disabled: true },
        field: {
          activeErrors: new Set(['customServerError']),
          isLoading: true,
          isReadOnly: true,
          isRequired: true,
        },
      })

      cy.getByTestId('control').then(([root]) => {
        const names = Array.from(root.attributes, ({ name }) => name)

        expect(
          names.filter((name) => !GLOBAL_ATTRIBUTE.test(name)),
        ).to.deep.equal([])
      })
    })
  })

  describe('relationships', () => {
    it('REQ-015 names the custom root from the field label', () => {
      mountCustomRoot({ control: CUSTOM_CHECKBOX })

      cy.getByTestId('control').assertReferences('aria-labelledby', ['label'])
    })

    it('REQ-016 describes the custom root with the field description', () => {
      mountCustomRoot({ control: CUSTOM_CHECKBOX })

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it('REQ-017 REQ-018 marks visible errors and references their message', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { activeErrors: new Set(['customServerError']) },
      })

      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
      cy.getByTestId('error').should('have.text', SERVER_ERROR_MESSAGE)
    })

    it('REQ-019 omits aria-errormessage without visible errors', () => {
      mountCustomRoot({ control: CUSTOM_CHECKBOX })

      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })

  describe('required', () => {
    it('REQ-009 marks a required field with aria-required', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isRequired: true },
      })

      cy.getByTestId('control').should('have.attr', 'aria-required', 'true')
    })
  })

  describe('readonly', () => {
    it('REQ-011 marks a readonly field with aria-readonly', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isReadOnly: true },
      })

      cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-023 keeps a readonly custom root enabled', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isReadOnly: true },
      })

      cy.getByTestId('control').should('not.have.attr', 'aria-disabled')
    })
  })

  describe('loading and disabled', () => {
    it('REQ-025 marks a loading custom root busy', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isLoading: true },
      })

      cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
    })

    it('PRD-016 gives a loading custom root the data-loading hook', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isLoading: true },
      })

      cy.getByTestId('control').should('have.attr', 'data-loading', '')
    })

    it('REQ-027 marks a loading custom root aria-disabled', () => {
      mountCustomRoot({
        control: CUSTOM_CHECKBOX,
        field: { isLoading: true },
      })

      cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-035 PRD-007 renders the disabled option as aria-disabled', () => {
      mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, disabled: true } })

      cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
    })
  })

  describe('checked state', () => {
    const CHECKED_STATES: readonly boolean[] = [true, false]

    CHECKED_STATES.forEach((checked) => {
      it(`REQ-008 renders checked=${checked} as aria-checked`, () => {
        mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, checked } })

        cy.getByTestId('control').should(
          'have.attr',
          'aria-checked',
          String(checked),
        )
      })
    })
  })

  describe('errors', () => {
    it('PRD-011 reports custom root validity through the validity handlers', () => {
      let isValid = false

      mountReportingCustomRoot(() => isValid)

      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)

      cy.then(() => {
        isValid = true
      })
      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('error').find('p').should('have.length', 0)
    })
  })
})
