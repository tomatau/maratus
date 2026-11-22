import { Description, FieldRoot } from '../src'
import {
  FIELD_DESCRIPTION,
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  relationshipRootProps,
} from './fieldHarness'

const LOCAL_DESCRIPTION = 'Local description'

describe('Description', () => {
  it('REQ-005 PRD-003 renders the context description with an id', () => {
    mountDescription()

    cy.getByTestId('description')
      .should('have.text', FIELD_DESCRIPTION)
      .and('have.attr', 'id')
      .and('not.equal', '')
  })

  it('PRD-003 renders local children before the context description', () => {
    mountDescription(
      <Description data-testid="description">{LOCAL_DESCRIPTION}</Description>,
    )

    cy.getByTestId('description').should('have.text', LOCAL_DESCRIPTION)
  })

  it('GPRD-005 applies default and consumer class names to the description', () => {
    mountDescription(
      <Description
        className="custom-description"
        data-testid="description"
      />,
    )

    cy.getByTestId('description')
      .should('have.attr', 'class')
      .and('contain', 'description')
      .and('contain', 'custom-description')
  })

  it('GPRD-005 GPRD-006 supports common root props on Description without overriding relationship props', () => {
    mountDescription(
      <Description {...createCommonRootProps(relationshipRootProps)} />,
    )

    cy.get('[data-common-root-prop="supported"]').assertSupportsProps(
      relationshipRootProps,
    )
  })

  it('PRD-013 keeps description wiring when substituting its root', () => {
    mountDescription(
      <Description
        as="span"
        data-testid="description"
      />,
    )

    cy.getByTestId('description').should('match', 'span')
    cy.getByTestId('control').assertReferences('aria-describedby', [
      'description',
    ])
  })
})

function mountDescription(
  description = <Description data-testid="description" />,
) {
  cy.mount(
    <FieldRoot
      description={FIELD_DESCRIPTION}
      label={FIELD_LABEL}
      name={FIELD_NAME}
    >
      <InputControl />
      {description}
    </FieldRoot>,
  )
}
