import type { TextControlRenderArgs, TextControlRole } from '../src'
import type { FieldErrorKey, FieldErrorPolicy } from '@maratus-component/field'
import type { ReactNode } from 'react'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { TextControl } from '../src'

describe('TextControl', () => {
  describe('native text controls', () => {
    it('REQ-001 REQ-002 REQ-003 REQ-004 PRD-001 renders native text control props with no automatic axe violations', () => {
      cy.mount(
        <FieldRoot
          description="Used for receipts."
          isRequired
          label="Email"
          name="email"
        >
          <Label />
          <TextControl>
            {({ textControlProps }) => (
              <input
                data-testid="control"
                type="email"
                {...textControlProps}
              />
            )}
          </TextControl>
          <Description />
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.name, 'field name').to.equal('email')
        expect(control.required, 'required').to.equal(true)
        expect(control.type, 'input type').to.equal('email')
      })
      cy.getByTestId('control').should('not.have.attr', 'aria-required')
      cy.getByTestId('control').should('not.have.attr', 'aria-readonly')

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })

    it('REQ-004 REQ-005 PRD-001 exposes readonly and loading state as native props', () => {
      cy.mount(
        <FieldRoot
          isLoading
          isReadOnly
          label="Email"
          name="email"
        >
          <TextControl>
            {({ textControlProps }) => (
              <input
                data-testid="control"
                type="text"
                {...textControlProps}
              />
            )}
          </TextControl>
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.disabled, 'disabled').to.equal(true)
        expect(control.readOnly, 'read only').to.equal(true)
      })
      cy.getByTestId('control')
        .should('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-006 preserves consumer native text attributes and constraint validation behaviour', () => {
      cy.mount(
        <FieldRoot
          label="Age"
          name="age"
        >
          <TextControl>
            {({ textControlProps }) => (
              <input
                data-testid="control"
                autoComplete="bday-year"
                max={120}
                maxLength={3}
                min={18}
                minLength={2}
                pattern="[0-9]+"
                required
                type="number"
                {...textControlProps}
              />
            )}
          </TextControl>
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.name, 'field name').to.equal('age')
        expect(control.type, 'input type').to.equal('number')
        expect(control.required, 'required').to.equal(true)
        expect(control.min, 'minimum').to.equal('18')
        expect(control.max, 'maximum').to.equal('120')
        expect(control.minLength, 'minimum length').to.equal(2)
        expect(control.maxLength, 'maximum length').to.equal(3)
        expect(control.pattern, 'pattern').to.equal('[0-9]+')
        expect(control.autocomplete, 'autocomplete').to.equal('bday-year')
        expect(control.validity.valueMissing, 'valueMissing').to.equal(true)
      })
    })
  })

  describe('role-aware text controls', () => {
    const roleCases: readonly {
      attributes: Record<string, string>
      role: TextControlRole
    }[] = [
      {
        attributes: {
          contenteditable: 'true',
          'aria-multiline': 'true',
        },
        role: 'textbox',
      },
      {
        attributes: {
          contenteditable: 'true',
        },
        role: 'searchbox',
      },
      {
        attributes: {
          'aria-controls': 'email-options',
          'aria-expanded': 'false',
          'aria-haspopup': 'listbox',
        },
        role: 'combobox',
      },
    ]

    function mountRoleValidityField({
      control,
      errorPolicy,
      role,
    }: {
      control: (args: TextControlRenderArgs) => ReactNode
      errorPolicy?: FieldErrorPolicy
      role: TextControlRole
    }) {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Choose a valid value.'],
      ])

      cy.mount(
        <FieldRoot
          errorMap={errorMap}
          errorPolicy={errorPolicy}
          label="Email"
          name="email"
        >
          <TextControl role={role}>{control}</TextControl>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )
    }

    function expectNativeRoleValidityError(role: TextControlRole) {
      cy.getByTestId<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('control').then(($control) => {
        $control.get(0).checkValidity()
      })
      cy.getByTestId('control')
        .should('have.attr', 'role', role)
        .and('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', 'Choose a valid value.')
    }

    roleCases.forEach(({ attributes, role }) => {
      it(`REQ-007 REQ-008 REQ-009 REQ-010 PRD-002 supports ${role} text control props`, () => {
        const errorMap = new Map<FieldErrorKey, string>([
          ['customServerError', 'Choose a valid value.'],
        ])

        cy.mount(
          <FieldRoot
            activeErrors={new Set(['customServerError'])}
            description="Used for receipts."
            errorMap={errorMap}
            isLoading
            isReadOnly
            isRequired
            label="Email"
            name="email"
          >
            <TextControl role={role}>
              {({ textControlProps }) => (
                <div
                  data-testid="control"
                  {...attributes}
                  {...textControlProps}
                />
              )}
            </TextControl>
            <Description data-testid="description" />
            <ErrorMessage data-testid="error" />
          </FieldRoot>,
        )

        cy.getByTestId('control')
          .should('have.attr', 'role', role)
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
        Object.entries(attributes).forEach(([name, value]) => {
          cy.getByTestId('control').should('have.attr', name, value)
        })
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

    it('REQ-011 PRD-002 keeps textarea validity handlers available for textbox controls', () => {
      mountRoleValidityField({
        control: ({ textControlProps }) => (
          <textarea
            data-testid="control"
            required
            {...textControlProps}
          />
        ),
        role: 'textbox',
      })

      expectNativeRoleValidityError('textbox')
    })

    it('REQ-011 PRD-002 keeps search input validity handlers available for searchbox controls', () => {
      mountRoleValidityField({
        control: ({ textControlProps }) => (
          <input
            data-testid="control"
            required
            type="search"
            {...textControlProps}
          />
        ),
        role: 'searchbox',
      })

      expectNativeRoleValidityError('searchbox')
    })

    it('REQ-011 PRD-002 keeps select validity handlers available for combobox controls', () => {
      mountRoleValidityField({
        control: ({ textControlProps }) => (
          <select
            data-testid="control"
            required
            {...textControlProps}
          >
            <option value="">Choose one</option>
            <option value="email">Email</option>
          </select>
        ),
        role: 'combobox',
      })

      expectNativeRoleValidityError('combobox')
    })

    it('REQ-012 PRD-002 lets custom controls wrap events with ValidityState', () => {
      let isValid = false

      mountRoleValidityField({
        control: ({ textControlProps, withValidity }) => (
          <div
            data-testid="control"
            {...textControlProps}
            onInput={(event) =>
              textControlProps.onInput?.(
                withValidity(event, {
                  valid: isValid,
                  valueMissing: !isValid,
                }),
              )
            }
          />
        ),
        errorPolicy: () => true,
        role: 'textbox',
      })

      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control')
        .should('have.attr', 'role', 'textbox')
        .and('have.attr', 'aria-invalid', 'true')
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
