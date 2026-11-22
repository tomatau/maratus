import type { FieldErrorKey } from '../src'
import {
  Description,
  ErrorMessage,
  FieldControl,
  FieldProvider,
  FieldRoot,
  Label,
} from '../src'
import {
  FIELD_DESCRIPTION,
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  VALUE_MISSING_ERROR_MAP,
  VALUE_MISSING_ERRORS,
  commonRootProps,
} from './fieldHarness'

const EXPLICIT_CONTROL_ID = 'email-control'

describe('FieldRoot', () => {
  it('PRD-002 renders the minimum field contract with no automatic axe violations', () => {
    cy.mount(
      <FieldRoot
        description={FIELD_DESCRIPTION}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label />
        <InputControl type="text" />
        <Description />
      </FieldRoot>,
    )

    cy.injectAxeAtRoot()
    cy.auditA11y()
  })

  it('PRD-001 exports the initial field primitive set', () => {
    for (const primitive of [
      FieldRoot,
      FieldProvider,
      FieldControl,
      Label,
      Description,
      ErrorMessage,
    ]) {
      expect(primitive).to.be.a('function')
    }
  })

  it('REQ-001 PRD-002 PRD-004 generates document-unique ids for each field relationship target', () => {
    cy.mount(
      <>
        {['first', 'second'].map((field) => (
          <FieldRoot
            activeErrors={VALUE_MISSING_ERRORS}
            description={FIELD_DESCRIPTION}
            errorMap={VALUE_MISSING_ERROR_MAP}
            key={field}
            label={FIELD_LABEL}
            name={`${field}-email`}
          >
            <InputControl data-testid={`${field}-control`} />
            <Description data-testid={`${field}-description`} />
            <ErrorMessage data-testid={`${field}-error`} />
          </FieldRoot>
        ))}
      </>,
    )

    cy.get('[data-testid]').should(($elements) => {
      const ids = [...$elements].map((element) => element.id)

      expect(ids).to.have.length(6)
      expect(ids).to.not.include('')
      expect(new Set(ids)).to.have.length(ids.length)
    })
  })

  it('REQ-004 uses an explicit controlId for label and control wiring', () => {
    cy.mount(
      <FieldRoot
        controlId={EXPLICIT_CONTROL_ID}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label data-testid="label" />
        <InputControl />
      </FieldRoot>,
    )

    cy.getByTestId('label').should('have.attr', 'for', EXPLICIT_CONTROL_ID)
    cy.getByTestId('control').should('have.attr', 'id', EXPLICIT_CONTROL_ID)
  })

  it('GPRD-005 applies default and consumer class names to the field root', () => {
    cy.mount(
      <FieldRoot
        className="custom-field"
        data-testid="field"
        label={FIELD_LABEL}
        name={FIELD_NAME}
      />,
    )

    cy.getByTestId('field')
      .should('have.attr', 'class')
      .and('contain', 'field')
      .and('contain', 'custom-field')
  })

  it('GPRD-005 supports common root props on FieldRoot', () => {
    cy.mount(
      <FieldRoot
        {...createCommonRootProps(commonRootProps)}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      />,
    )

    cy.getRootElement().assertSupportsProps(commonRootProps)
  })

  it('PRD-013 supports root substitution for the field root', () => {
    cy.mount(
      <FieldRoot
        as="section"
        data-testid="field"
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <InputControl />
      </FieldRoot>,
    )

    cy.getByTestId('field').should('match', 'section')
    cy.getByTestId('control').should('have.attr', 'id')
  })

  it('REQ-031 PRD-019 marks a loading field root busy', () => {
    cy.mount(
      <FieldRoot
        data-testid="field"
        isLoading
        label={FIELD_LABEL}
        name={FIELD_NAME}
      />,
    )

    cy.getByTestId('field')
      .should('have.attr', 'aria-busy', 'true')
      .and('have.attr', 'data-loading')
  })

  it('PRD-006 uses activeErrors as the current active error keys', () => {
    const errorMap = new Map<FieldErrorKey, string>([
      ['valueMissing', 'Enter an email address.'],
      ['typeMismatch', 'Enter a valid email address.'],
      ['tooShort', 'Use at least 8 characters.'],
      ['customServerError', 'This email is already registered.'],
    ])
    const activeErrors = new Set<FieldErrorKey>([
      'typeMismatch',
      'customServerError',
    ])

    cy.mount(
      <FieldRoot
        activeErrors={activeErrors}
        errorMap={errorMap}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <InputControl
          required
          type="email"
        />
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId('error')
      .find('p')
      .should('have.length', 2)
      .then(($messages) => [...$messages].map((message) => message.textContent))
      .should('deep.equal', [
        'Enter a valid email address.',
        'This email is already registered.',
      ])
    cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
  })
})
