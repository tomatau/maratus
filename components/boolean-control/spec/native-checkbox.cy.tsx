import type { BooleanControlRole } from '../src'
import {
  FIELD_NAME,
  NATIVE_DISABLED_CASES,
  VALUE_MISSING_MESSAGE,
  mountNativeCheckbox,
} from './booleanControlField'

// Not part of the options type, as a JavaScript consumer could still pass it.
const UNSUPPORTED_READ_ONLY: object = { readOnly: true }

describe('BooleanControl native mode', () => {
  describe('semantics', () => {
    it('REQ-002 PRD-010 renders native checkbox props with no automatic axe violations', () => {
      mountNativeCheckbox({ field: { isRequired: true } })

      cy.getByTestId('control')
        .should('have.prop', 'type', 'checkbox')
        .and('have.prop', 'name', FIELD_NAME)

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })

    it('REQ-002 REQ-012 PRD-002 keeps a native switch an input with role="switch"', () => {
      mountNativeCheckbox({ control: { role: 'switch' } })

      cy.getByTestId('control')
        .should('have.attr', 'type', 'checkbox')
        .and('have.attr', 'role', 'switch')
    })

    const IMPLICIT_ROLES: readonly (BooleanControlRole | undefined)[] = [
      undefined,
      'checkbox',
    ]

    IMPLICIT_ROLES.forEach((role) => {
      it(`REQ-013 omits an explicit role when role is ${role ?? 'unset'}`, () => {
        mountNativeCheckbox({ control: { role } })

        cy.getByTestId('control').should('not.have.attr', 'role')
      })
    })
  })

  describe('relationships', () => {
    it('REQ-001 labels the native checkbox with the label for attribute', () => {
      mountNativeCheckbox()

      cy.getByTestId('label').assertReferences('for', ['control'])
    })

    it('REQ-016 describes the native checkbox with the field description', () => {
      mountNativeCheckbox()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it('REQ-017 REQ-018 marks visible errors and references their message', () => {
      mountNativeCheckbox({
        field: { activeErrors: new Set(['customServerError']) },
      })

      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
    })

    it('REQ-019 omits aria-errormessage without visible errors', () => {
      mountNativeCheckbox()

      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })

  describe('required', () => {
    it('REQ-004 marks a required field with the required attribute', () => {
      mountNativeCheckbox({ field: { isRequired: true } })

      cy.getByTestId('control').should('have.prop', 'required', true)
    })

    it('REQ-020 leaves aria-required off a required native checkbox', () => {
      mountNativeCheckbox({ field: { isRequired: true } })

      cy.getByTestId('control').should('not.have.attr', 'aria-required')
    })
  })

  describe('readonly', () => {
    it('REQ-024 marks a readonly field with aria-readonly', () => {
      mountNativeCheckbox({ field: { isReadOnly: true } })

      cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-022 leaves the readonly attribute off a readonly native checkbox', () => {
      mountNativeCheckbox({ field: { isReadOnly: true } })

      cy.getByTestId('control').should('not.have.attr', 'readonly')
    })

    it('REQ-023 keeps a readonly native checkbox enabled', () => {
      mountNativeCheckbox({ field: { isReadOnly: true } })

      cy.getByTestId('control').should('have.prop', 'disabled', false)
    })

    describe('readOnly option', () => {
      beforeEach(() => {
        cy.spy(console, 'warn').as('warn')
      })

      it('PRD-006 strips readOnly and warns towards isReadOnly', () => {
        mountNativeCheckbox({ control: { ...UNSUPPORTED_READ_ONLY } })

        cy.get('@warn').should('have.been.calledWithMatch', 'isReadOnly')
        cy.getByTestId('control').should('not.have.attr', 'readonly')
      })

      it('PRD-006 stays silent without readOnly', () => {
        mountNativeCheckbox()

        cy.get('@warn').should('not.have.been.called')
      })
    })
  })

  describe('checked state', () => {
    const CHECKED_STATES: readonly boolean[] = [true, false]

    CHECKED_STATES.forEach((checked) => {
      it(`REQ-006 REQ-014 renders checked=${checked} as the checked property, not aria-checked`, () => {
        mountNativeCheckbox({ control: { checked } })

        cy.getByTestId('control')
          .should('have.prop', 'checked', checked)
          .and('not.have.attr', 'aria-checked')
      })
    })

    it('PRD-005 follows the checked option when it is set', () => {
      mountNativeCheckbox({ control: { checked: false } })

      cy.getByTestId('control').click()
      cy.getByTestId('control').should('have.prop', 'checked', false)
    })

    it('PRD-005 leaves an unset checked state to the browser', () => {
      mountNativeCheckbox({ control: { defaultChecked: true } })

      cy.getByTestId('control').should('have.prop', 'checked', true)
      cy.getByTestId('control').click()
      cy.getByTestId('control').should('have.prop', 'checked', false)
    })
  })

  describe('loading and disabled', () => {
    it('REQ-005 disables a loading native checkbox', () => {
      mountNativeCheckbox({ field: { isLoading: true } })

      cy.getByTestId('control').should('have.prop', 'disabled', true)
    })

    it('REQ-025 marks a loading native checkbox busy', () => {
      mountNativeCheckbox({ field: { isLoading: true } })

      cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
    })

    it('PRD-016 gives a loading native checkbox the data-loading hook', () => {
      mountNativeCheckbox({ field: { isLoading: true } })

      cy.getByTestId('control').should('have.attr', 'data-loading', '')
    })

    it('REQ-034 PRD-007 renders the disabled option as the disabled attribute', () => {
      mountNativeCheckbox({ control: { disabled: true } })

      cy.getByTestId('control').should('have.prop', 'disabled', true)
    })

    NATIVE_DISABLED_CASES.forEach(({ options, state }) => {
      it(`REQ-026 leaves aria-disabled off a ${state} native checkbox`, () => {
        mountNativeCheckbox(options)

        cy.getByTestId('control').should('not.have.attr', 'aria-disabled')
      })
    })
  })

  describe('errors', () => {
    it('PRD-003 reports native checkbox validity to the field', () => {
      mountNativeCheckbox({
        field: { errorPolicy: () => true, isRequired: true },
      })

      cy.getByTestId('control').check()
      cy.getByTestId('control').uncheck()
      cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)

      cy.getByTestId('control').check()
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('error').find('p').should('have.length', 0)
    })
  })
})
