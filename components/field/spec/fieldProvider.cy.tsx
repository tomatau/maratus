import { Description, FieldProvider, Label } from '../src'
import {
  FIELD_DESCRIPTION,
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
} from './fieldHarness'

describe('FieldProvider', () => {
  beforeEach(() => {
    cy.mount(
      <FieldProvider
        description={FIELD_DESCRIPTION}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label data-testid="label" />
        <InputControl />
        <Description data-testid="description" />
      </FieldProvider>,
    )
  })

  it('GPRD-007 PRD-020 provides field content without a field root', () => {
    cy.getByTestId('label').should('have.text', FIELD_LABEL)
    cy.getByTestId('description').should('have.text', FIELD_DESCRIPTION)
  })

  it('GPRD-007 PRD-020 preserves label and description wiring', () => {
    cy.getByTestId('label').assertReferences('for', ['control'])
    cy.getByTestId('control').assertReferences('aria-describedby', [
      'description',
    ])
  })
})
