import type { FieldRootProps } from '../src'
import { FieldRoot, Label } from '../src'
import {
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  relationshipRootProps,
} from './fieldHarness'

const LOCAL_LABEL = 'Local label'

type LabelFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

const STATE_HOOK_CASES = [
  {
    attribute: 'data-required',
    fieldState: { isRequired: true },
    title: 'PRD-015 PRD-016 exposes required state with data-required',
  },
  {
    attribute: 'data-readonly',
    fieldState: { isReadOnly: true },
    title: 'PRD-015 PRD-017 exposes readonly state with data-readonly',
  },
  {
    attribute: 'data-loading',
    fieldState: { isLoading: true },
    title: 'PRD-019 exposes loading state with data-loading',
  },
] satisfies { attribute: string; fieldState: LabelFieldState; title: string }[]

describe('Label', () => {
  it('REQ-002 points the label at the generated control id', () => {
    mountLabel()

    cy.getByTestId('label').assertReferences('for', ['control'])
  })

  it('PRD-003 renders the field label from context', () => {
    mountLabel()

    cy.getByTestId('label').should('have.text', FIELD_LABEL)
  })

  it('PRD-003 renders local children before the context label', () => {
    cy.mount(
      <FieldRoot
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label data-testid="label">{LOCAL_LABEL}</Label>
      </FieldRoot>,
    )

    cy.getByTestId('label').should('have.text', LOCAL_LABEL)
  })

  it('GPRD-005 applies default and consumer class names to the label', () => {
    cy.mount(
      <FieldRoot
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label
          className="custom-label"
          data-testid="label"
        />
      </FieldRoot>,
    )

    cy.getByTestId('label')
      .should('have.attr', 'class')
      .and('contain', 'label')
      .and('contain', 'custom-label')
  })

  it('GPRD-005 GPRD-006 supports common root props on Label without overriding relationship props', () => {
    cy.mount(
      <FieldRoot
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <Label {...createCommonRootProps(relationshipRootProps)} />
      </FieldRoot>,
    )

    cy.get('label').assertSupportsProps(relationshipRootProps)
  })

  for (const { attribute, fieldState, title } of STATE_HOOK_CASES) {
    it(title, () => {
      mountLabel(fieldState)

      cy.getByTestId('label').should('have.attr', attribute)
    })
  }
})

function mountLabel(fieldState: LabelFieldState = {}) {
  cy.mount(
    <FieldRoot
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...fieldState}
    >
      <Label data-testid="label" />
      <InputControl />
    </FieldRoot>,
  )
}
