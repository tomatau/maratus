import type { ChoiceControlDisabledBehavior } from '../src'
import type { FieldRootProps, ValidityErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { ChoiceControl } from '../src'

const FIELD_NAME = 'select-field'
const FIELD_LABEL = 'Select field'
const FIELD_DESCRIPTION = 'Select field description.'
const EMPTY_OPTION = ''
const FIRST_OPTION = 'first-option'
const SECOND_OPTION = 'second-option'
const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

type SelectFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

describe('ChoiceControl select mode', () => {
  describe('attributes', () => {
    it('REQ-001 matches the label for attribute to the select id', () => {
      mountSelect()

      cy.getByTestId('label').assertReferences('for', ['control'])
    })

    it('PRD-012 uses the field name', () => {
      mountSelect()

      cy.getByTestId('control').should('have.prop', 'name', FIELD_NAME)
    })

    it('REQ-003 sets required when the field is required', () => {
      mountSelect({ isRequired: true })

      cy.getByTestId('control').should('have.prop', 'required', true)
    })

    it('REQ-004 omits an explicit role', () => {
      mountSelect()

      cy.getByTestId('control').should('not.have.attr', 'role')
    })

    it('REQ-005 omits aria-required when required is present', () => {
      mountSelect({ isRequired: true })

      cy.getByTestId('control').should('not.have.attr', 'aria-required')
    })

    it('REQ-006 sets aria-readonly when the field is readonly', () => {
      mountSelect({ isReadOnly: true })

      cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-025 references the description with aria-describedby', () => {
      mountSelect()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })
  })

  describe('loading', () => {
    beforeEach(() => {
      mountSelect({ isLoading: true })
    })

    it('REQ-032 sets aria-busy', () => {
      cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
    })

    it('REQ-033 sets disabled', () => {
      cy.getByTestId('control').should('have.prop', 'disabled', true)
    })

    it('REQ-034 omits aria-disabled', () => {
      cy.getByTestId('control').should('not.have.attr', 'aria-disabled')
    })

    it('PRD-023 stays disabled when disabledBehavior is focusable', () => {
      mountSelect({ isLoading: true }, 'focusable')

      cy.getByTestId('control').should('have.prop', 'disabled', true)
      cy.getByTestId('control').should('not.have.attr', 'aria-disabled')
    })
  })

  describe('errors', () => {
    beforeEach(() => {
      mountSelect({ isRequired: true })
      cy.getByTestId('form').checkFormValidity()
    })

    it('PRD-013 REQ-050 REQ-051 exposes a browser-detected error', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
    })

    it('PRD-013 REQ-053 clears the error once the select is valid', () => {
      cy.getByTestId('control').select(FIRST_OPTION)

      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })

  describe('interaction', () => {
    it('REQ-038 picks an option by pointer and clears the previous one', () => {
      mountSelect()

      cy.getByTestId('control').select(FIRST_OPTION)
      cy.getByTestId('control').select(SECOND_OPTION)

      cy.getByTestId<HTMLSelectElement>('control').should(($control) => {
        const selectedValues = [...$control.get(0).selectedOptions].map(
          (option) => option.value,
        )
        expect(selectedValues).to.deep.equal([SECOND_OPTION])
      })
    })

    it('REQ-039 selects an option with native keyboard type-ahead', () => {
      mountSelect()

      cy.getByTestId('control').focus().realPress('f')

      cy.getByTestId('control').should('have.value', FIRST_OPTION)
    })

    it('REQ-052 keeps a readonly select enabled and focusable', () => {
      mountSelect({ isReadOnly: true })

      cy.getByTestId('control').focus().should('have.focus')
    })

    it('REQ-040 ignores pointer interaction while disabled', () => {
      mountSelect({ isLoading: true })

      cy.getByTestId('control').realClick()

      cy.getByTestId('control')
        .should('not.have.focus')
        .and('have.value', EMPTY_OPTION)
    })

    it('REQ-041 ignores keyboard interaction while disabled', () => {
      mountSelect({ isLoading: true })

      cy.getByTestId<HTMLSelectElement>('control').then(($control) => {
        $control.get(0).focus()
      })
      cy.realPress('f')

      cy.getByTestId('control')
        .should('not.have.focus')
        .and('have.value', EMPTY_OPTION)
    })
  })

  describe('accessibility', () => {
    it('REQ-001 REQ-003 REQ-004 REQ-005 REQ-006 REQ-025 PRD-002 has no violations', () => {
      mountSelect({ isReadOnly: true, isRequired: true })

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })
})

function mountSelect(
  fieldState: SelectFieldState = {},
  disabledBehavior?: ChoiceControlDisabledBehavior,
) {
  cy.mount(
    <form data-testid="form">
      <FieldRoot
        description={FIELD_DESCRIPTION}
        errorMap={ERROR_MAP}
        label={FIELD_LABEL}
        name={FIELD_NAME}
        {...fieldState}
      >
        <Label data-testid="label" />
        <ChoiceControl
          disabledBehavior={disabledBehavior}
          mode="select"
        >
          {({ choiceControlProps }) => (
            <select
              data-testid="control"
              defaultValue={EMPTY_OPTION}
              {...choiceControlProps}
            >
              <option value={EMPTY_OPTION}>Empty option</option>
              <option value={FIRST_OPTION}>First option</option>
              <option value={SECOND_OPTION}>Second option</option>
            </select>
          )}
        </ChoiceControl>
        <Description data-testid="description" />
        <ErrorMessage data-testid="error" />
      </FieldRoot>
    </form>,
  )
}
