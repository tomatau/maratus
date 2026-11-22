import type { ValidityErrorKey } from '@maratus-component/field'
import type { ReactNode } from 'react'
import { ErrorMessage, FieldRoot } from '@maratus-component/field'
import { ChoicesControl } from '../src'

const FIELD_NAME = 'consumer-field'
const FIELD_LABEL = 'Consumer field'
const FIRST_CHOICE = 'first-choice'
const UNSUPPORTED_READONLY: object = { readOnly: true }
const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

describe('ChoicesControl consumer ownership', () => {
  it('PRD-003 keeps an item unselected when the consumer does not select it', () => {
    mountField(
      <ChoicesControl mode="checkbox-items">
        {({ choicesControlProps, getChoicesItemProps }) => (
          <div {...choicesControlProps}>
            <div
              data-testid={FIRST_CHOICE}
              tabIndex={0}
              {...getChoicesItemProps({ isSelected: false })}
            >
              {FIRST_CHOICE}
            </div>
          </div>
        )}
      </ChoicesControl>,
    )

    cy.getByTestId(FIRST_CHOICE).click()

    cy.getByTestId(FIRST_CHOICE).should('have.attr', 'aria-checked', 'false')
  })

  it('PRD-007 lets a readonly consumer prevent a checkbox change', () => {
    mountField(
      <ChoicesControl
        mode="checkboxes"
        onChange={(event) => event.preventDefault()}
      >
        {({ choicesControlProps, getChoicesInputProps }) => (
          <div {...choicesControlProps}>
            <input
              data-testid={FIRST_CHOICE}
              {...getChoicesInputProps({ value: FIRST_CHOICE })}
            />
          </div>
        )}
      </ChoicesControl>,
      { isReadOnly: true },
    )

    cy.getByTestId(FIRST_CHOICE).click()

    cy.getByTestId(FIRST_CHOICE).should('not.be.checked')
  })

  it('PRD-005 leaves form submission to the consumer when a group error is reported', () => {
    const onSubmit = cy
      .stub()
      .callsFake((event: SubmitEvent) => event.preventDefault())
      .as('submit')
    cy.mount(
      <form onSubmit={onSubmit}>
        <FieldRoot
          errorMap={ERROR_MAP}
          label={FIELD_LABEL}
          name={FIELD_NAME}
        >
          <ChoicesControl mode="checkbox-items">
            {({ choicesControlProps }) => (
              <div
                data-testid="control"
                tabIndex={0}
                {...choicesControlProps}
                onBlur={(event) =>
                  choicesControlProps.onBlur(event, { valueMissing: true })
                }
              />
            )}
          </ChoicesControl>
          <ErrorMessage data-testid="error" />
        </FieldRoot>
        <button type="submit">Submit</button>
      </form>,
    )
    cy.getByTestId('control').focus()
    cy.getByTestId('control').blur()
    cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)

    cy.get('button').click()

    cy.get('@submit').should('have.been.calledOnce')
  })

  describe('readonly warnings', () => {
    beforeEach(() => {
      cy.spy(console, 'warn').as('warn')
    })

    const warningCases = [
      {
        control: (
          <ChoicesControl
            mode="checkbox-items"
            {...UNSUPPORTED_READONLY}
          >
            {({ choicesControlProps }) => (
              <div
                data-testid="warned-control"
                {...choicesControlProps}
              />
            )}
          </ChoicesControl>
        ),
        title: 'PRD-009 warns when readOnly reaches ChoicesControl',
      },
      {
        control: (
          <ChoicesControl mode="checkboxes">
            {({ choicesControlProps, getChoicesInputProps }) => (
              <div {...choicesControlProps}>
                <input
                  data-testid="warned-control"
                  {...getChoicesInputProps({
                    ...UNSUPPORTED_READONLY,
                    value: FIRST_CHOICE,
                  })}
                />
              </div>
            )}
          </ChoicesControl>
        ),
        title: 'PRD-009 warns when readOnly reaches a checkbox option',
      },
    ] satisfies { control: ReactNode; title: string }[]

    for (const { control, title } of warningCases) {
      it(title, () => {
        mountField(control)

        cy.get('@warn').should('have.been.calledWithMatch', 'isReadOnly')
        cy.getByTestId('warned-control').should('not.have.attr', 'readonly')
      })
    }

    it('PRD-009 stays silent without readOnly', () => {
      mountField(
        <ChoicesControl mode="checkbox-items">
          {({ choicesControlProps }) => <div {...choicesControlProps} />}
        </ChoicesControl>,
      )

      cy.get('@warn').should('not.have.been.called')
    })
  })
})

function mountField(control: ReactNode, fieldState = {}) {
  cy.mount(
    <FieldRoot
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...fieldState}
    >
      {control}
    </FieldRoot>,
  )
}
