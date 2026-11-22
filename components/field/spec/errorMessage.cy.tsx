import type { FieldErrorKey } from '../src'
import { ErrorMessage, FieldRoot } from '../src'
import {
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  VALUE_MISSING_ERROR_MAP,
  VALUE_MISSING_ERRORS,
  VALUE_MISSING_MESSAGE,
  relationshipRootProps,
} from './fieldHarness'

describe('ErrorMessage', () => {
  it('REQ-007 REQ-011 PRD-003 renders a visible error with an id and role alert', () => {
    mountErrorMessage()

    cy.getByTestId('error')
      .should('have.text', VALUE_MISSING_MESSAGE)
      .and('have.attr', 'role', 'alert')
    cy.getByTestId('error').should('have.attr', 'id').and('not.equal', '')
  })

  it('REQ-011 omits role alert without visible errors', () => {
    mountErrorMessage(<ErrorMessage data-testid="error" />, new Set())

    cy.getByTestId('error').should('not.have.attr', 'role')
  })

  it('GPRD-005 applies default and consumer class names to the error message', () => {
    mountErrorMessage(
      <ErrorMessage
        className="custom-error"
        data-testid="error"
      />,
    )

    cy.getByTestId('error')
      .should('have.attr', 'class')
      .and('contain', 'errorMessageRoot')
      .and('contain', 'custom-error')
    cy.getByTestId('error')
      .find('p')
      .should('have.attr', 'class')
      .and('contain', 'errorMessage')
  })

  it('GPRD-005 GPRD-006 supports common root props on ErrorMessage without overriding relationship props', () => {
    mountErrorMessage(
      <ErrorMessage {...createCommonRootProps(relationshipRootProps)} />,
    )

    cy.get('[data-common-root-prop="supported"]').assertSupportsProps(
      relationshipRootProps,
    )
  })

  it('PRD-012 renders visible errors through renderChildren', () => {
    mountErrorMessage(
      <ErrorMessage
        data-testid="error"
        renderChildren={({ children, className, errorKey, key }) => (
          <span
            className={className}
            data-error-key={errorKey}
            data-render-key={key}
            data-testid="custom-error"
            key={key}
          >
            {children}
          </span>
        )}
      />,
    )

    cy.getByTestId('error').find('p').should('have.length', 0)
    cy.getByTestId('custom-error')
      .should('have.text', VALUE_MISSING_MESSAGE)
      .and('have.attr', 'class')
    cy.getByTestId('custom-error')
      .should('have.attr', 'data-error-key', 'valueMissing')
      .and('have.attr', 'data-render-key', 'valueMissing')
  })

  it('PRD-013 keeps error wiring when substituting its root', () => {
    mountErrorMessage(
      <ErrorMessage
        as="section"
        data-testid="error"
      />,
    )

    cy.getByTestId('error').should('match', 'section')
    cy.getByTestId('control').assertReferences('aria-errormessage', ['error'])
  })
})

function mountErrorMessage(
  errorMessage = <ErrorMessage data-testid="error" />,
  activeErrors: ReadonlySet<FieldErrorKey> = VALUE_MISSING_ERRORS,
) {
  cy.mount(
    <FieldRoot
      activeErrors={activeErrors}
      errorMap={VALUE_MISSING_ERROR_MAP}
      label={FIELD_LABEL}
      name={FIELD_NAME}
    >
      <InputControl />
      {errorMessage}
    </FieldRoot>,
  )
}
