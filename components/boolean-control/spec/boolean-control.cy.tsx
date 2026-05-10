import type { BooleanControlRole } from '../src'
import type { FieldErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { BooleanControl } from '../src'

describe('BooleanControl', () => {
  describe('native boolean controls', () => {
    it('REQ-001 REQ-002 REQ-003 REQ-004 PRD-001 renders native checkbox props with no automatic axe violations', () => {
      cy.mount(
        <FieldRoot
          description="Used for confirmations."
          isRequired
          label="Accept terms"
          name="terms"
        >
          <Label />
          <BooleanControl>
            {({ booleanControlProps }) => (
              <input
                data-testid="control"
                {...booleanControlProps}
              />
            )}
          </BooleanControl>
          <Description />
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.name, 'field name').to.equal('terms')
        expect(control.required, 'required').to.equal(true)
        expect(control.type, 'input type').to.equal('checkbox')
      })
      cy.getByTestId('control').should('not.have.attr', 'aria-required')
      cy.getByTestId('control').should('not.have.attr', 'aria-readonly')

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })

    it('REQ-004 REQ-005 PRD-001 exposes loading state as native disabled state', () => {
      cy.mount(
        <FieldRoot
          isLoading
          label="Accept terms"
          name="terms"
        >
          <BooleanControl>
            {({ booleanControlProps }) => (
              <input
                data-testid="control"
                {...booleanControlProps}
              />
            )}
          </BooleanControl>
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.disabled, 'disabled').to.equal(true)
      })
      cy.getByTestId('control')
        .should('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-006 preserves native checkbox checked state and validation behaviour', () => {
      cy.mount(
        <FieldRoot
          label="Accept terms"
          name="terms"
        >
          <BooleanControl>
            {({ booleanControlProps }) => (
              <input
                data-testid="control"
                required
                {...booleanControlProps}
              />
            )}
          </BooleanControl>
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.validity.valueMissing, 'valueMissing').to.equal(true)
      })
      cy.getByTestId('control').check()
      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.checked, 'checked').to.equal(true)
        expect(control.validity.valid, 'valid').to.equal(true)
      })
    })
  })

  describe('role-aware boolean controls', () => {
    const roleCases: readonly BooleanControlRole[] = ['checkbox', 'switch']

    roleCases.forEach((role) => {
      it(`REQ-007 REQ-008 REQ-009 REQ-011 PRD-002 supports ${role} boolean control props`, () => {
        const errorMap = new Map<FieldErrorKey, string>([
          ['customServerError', 'Choose a valid value.'],
        ])

        cy.mount(
          <FieldRoot
            activeErrors={new Set(['customServerError'])}
            description="Used for confirmations."
            errorMap={errorMap}
            isLoading
            isReadOnly
            isRequired
            label="Accept terms"
            name="terms"
          >
            <BooleanControl role={role}>
              {({ booleanControlProps }) => (
                <div
                  data-testid="control"
                  aria-checked="false"
                  {...booleanControlProps}
                />
              )}
            </BooleanControl>
            <Description data-testid="description" />
            <ErrorMessage data-testid="error" />
          </FieldRoot>,
        )

        cy.getByTestId('control')
          .should('have.attr', 'role', role)
          .and('have.attr', 'aria-checked', 'false')
          .and('have.attr', 'aria-required', 'true')
          .and('have.attr', 'aria-readonly', 'true')
          .and('have.attr', 'aria-busy', 'true')
          .and('have.attr', 'aria-disabled', 'true')
          .and('have.attr', 'aria-invalid', 'true')
          .and('have.attr', 'data-loading')
        cy.getByTestId('control').should('not.have.attr', 'required')
        cy.getByTestId('control').should('not.have.attr', 'readonly')
        cy.getByTestId('control').should('not.have.attr', 'disabled')
        cy.getByTestId('control').should('not.have.attr', 'name')
        cy.getByTestId('description')
          .invoke('attr', 'id')
          .then((descriptionId) => {
            cy.getByTestId('control').should(
              'have.attr',
              'aria-describedby',
              descriptionId,
            )
          })
        cy.getByTestId('error')
          .invoke('attr', 'id')
          .then((errorId) => {
            cy.getByTestId('control').should(
              'have.attr',
              'aria-errormessage',
              errorId,
            )
          })
      })
    })

    it('REQ-010 PRD-002 lets custom controls wrap events with ValidityState', () => {
      let isValid = false
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Choose a valid value.'],
      ])

      cy.mount(
        <FieldRoot
          errorMap={errorMap}
          errorPolicy={() => true}
          label="Accept terms"
          name="terms"
        >
          <BooleanControl role="checkbox">
            {({ booleanControlProps, withValidity }) => (
              <div
                data-testid="control"
                aria-checked={isValid}
                {...booleanControlProps}
                onInput={(event) =>
                  booleanControlProps.onInput?.(
                    withValidity(event, {
                      valid: isValid,
                      valueMissing: !isValid,
                    }),
                  )
                }
              />
            )}
          </BooleanControl>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )

      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', 'Choose a valid value.')

      cy.then(() => {
        isValid = true
      })
      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('error').find('p').should('have.length', 0)
    })
  })
})
