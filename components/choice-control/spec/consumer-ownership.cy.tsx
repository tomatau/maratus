import type { ReactNode } from 'react'
import { FieldRoot } from '@maratus-component/field'
import { useState } from 'react'
import { ChoiceControl } from '../src'

const FIELD_NAME = 'consumer-field'
const FIELD_LABEL = 'Consumer field'
const FIRST_CHOICE = 'first-choice'
const SECOND_CHOICE = 'second-choice'
const UNSUPPORTED_READONLY: object = { readOnly: true }

describe('ChoiceControl consumer ownership', () => {
  it('PRD-004 keeps an item unselected when the consumer does not select it', () => {
    mountField(
      <ChoiceControl mode="radio-items">
        {({ choiceControlProps, getChoiceItemProps }) => (
          <div {...choiceControlProps}>
            <div
              data-testid={FIRST_CHOICE}
              tabIndex={0}
              {...getChoiceItemProps({ isSelected: false })}
            >
              {FIRST_CHOICE}
            </div>
          </div>
        )}
      </ChoiceControl>,
    )

    cy.getByTestId(FIRST_CHOICE).click()

    cy.getByTestId(FIRST_CHOICE).should('have.attr', 'aria-checked', 'false')
  })

  it('PRD-007 lets a readonly controlled consumer keep its select value', () => {
    const onChange = cy.stub().as('change')
    mountField(<ControlledSelect onChange={onChange} />, { isReadOnly: true })

    cy.getByTestId('control').select(SECOND_CHOICE)

    cy.get('@change').should('have.been.calledOnce')
    cy.getByTestId('control').should('have.value', FIRST_CHOICE)
  })

  describe('readonly warnings', () => {
    beforeEach(() => {
      cy.spy(console, 'warn').as('warn')
    })

    const warningCases = [
      {
        control: (
          <ChoiceControl
            mode="select"
            {...UNSUPPORTED_READONLY}
          >
            {({ choiceControlProps }) => (
              <select
                data-testid="warned-control"
                {...choiceControlProps}
              />
            )}
          </ChoiceControl>
        ),
        title: 'PRD-008 warns when readOnly reaches ChoiceControl',
      },
      {
        control: (
          <ChoiceControl mode="radios">
            {({ choiceControlProps, getChoiceInputProps }) => (
              <div {...choiceControlProps}>
                <input
                  data-testid="warned-control"
                  {...getChoiceInputProps({
                    ...UNSUPPORTED_READONLY,
                    value: FIRST_CHOICE,
                  })}
                />
              </div>
            )}
          </ChoiceControl>
        ),
        title: 'PRD-008 warns when readOnly reaches a radio option',
      },
    ] satisfies { control: ReactNode; title: string }[]

    for (const { control, title } of warningCases) {
      it(title, () => {
        mountField(control)

        cy.get('@warn').should('have.been.calledWithMatch', 'isReadOnly')
        cy.getByTestId('warned-control').should('not.have.attr', 'readonly')
      })
    }

    it('PRD-008 stays silent without readOnly', () => {
      mountField(
        <ChoiceControl mode="select">
          {({ choiceControlProps }) => <select {...choiceControlProps} />}
        </ChoiceControl>,
      )

      cy.get('@warn').should('not.have.been.called')
    })
  })
})

function ControlledSelect(props: { onChange: () => void }) {
  const [value] = useState(FIRST_CHOICE)

  return (
    <ChoiceControl
      mode="select"
      onChange={props.onChange}
    >
      {({ choiceControlProps }) => (
        <select
          data-testid="control"
          value={value}
          {...choiceControlProps}
        >
          <option value={FIRST_CHOICE}>{FIRST_CHOICE}</option>
          <option value={SECOND_CHOICE}>{SECOND_CHOICE}</option>
        </select>
      )}
    </ChoiceControl>
  )
}

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
