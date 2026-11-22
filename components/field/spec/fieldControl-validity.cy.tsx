import { ErrorMessage, FieldControl, FieldRoot } from '../src'
import {
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  VALUE_MISSING_ERROR_MAP,
  VALUE_MISSING_MESSAGE,
} from './fieldHarness'

const GROUPED_NAME = 'grouped-inputs'
const FIRST_RADIO = 'first-radio'
const SECOND_RADIO = 'second-radio'
const REQUIRED_INPUT = 'required-input'
const OPTIONAL_INPUT = 'optional-input'

const GROUP_ROLES = {
  checkbox: 'group',
  radio: 'radiogroup',
} as const

type GroupedInputType = keyof typeof GROUP_ROLES

type GroupedInput = {
  isRequired: boolean
  value: string
}

describe('FieldControl validity reporting', () => {
  it('REQ-008 REQ-009 REQ-014 wires native validation errors to the field control', () => {
    cy.mount(
      <FieldRoot
        errorMap={VALUE_MISSING_ERROR_MAP}
        label={FIELD_LABEL}
        name={FIELD_NAME}
      >
        <InputControl required />
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId<HTMLInputElement>('control').then(($control) => {
      $control.get(0).checkValidity()
    })

    cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
    cy.getByTestId('control')
      .should('have.attr', 'aria-invalid', 'true')
      .assertReferences('aria-errormessage', ['error'])
  })

  describe('grouped native inputs', () => {
    it('PRD-014 reports validity from each native input in a grouped control', () => {
      mountGroupedInputs('radio', [
        { isRequired: true, value: FIRST_RADIO },
        { isRequired: true, value: SECOND_RADIO },
      ])
      cy.getByTestId('form').checkFormValidity()

      expectGroupedError()

      cy.get(`input[value="${FIRST_RADIO}"]`).check()

      expectNoGroupedError()
    })

    it('PRD-014 keeps an error from a required input when an optional input reports valid', () => {
      mountGroupedInputs('checkbox', [
        { isRequired: true, value: REQUIRED_INPUT },
        { isRequired: false, value: OPTIONAL_INPUT },
      ])
      cy.getByTestId('form').checkFormValidity()

      cy.get(`input[value="${OPTIONAL_INPUT}"]`).focus()

      expectGroupedError()
    })

    it('PRD-014 drops errors from an input that leaves the group', () => {
      mountGroupedInputs('checkbox', [
        { isRequired: true, value: REQUIRED_INPUT },
        { isRequired: false, value: OPTIONAL_INPUT },
      ]).then(({ rerender }) => {
        cy.getByTestId('form').checkFormValidity()
        expectGroupedError()

        rerender(
          <GroupedInputs
            inputs={[{ isRequired: false, value: OPTIONAL_INPUT }]}
            type="checkbox"
          />,
        )
        cy.get(`input[value="${REQUIRED_INPUT}"]`).should('not.exist')
        expectNoGroupedError()
      })
    })
  })

  describe('custom widget roots', () => {
    it('PRD-026 records blur history from a custom root without changing its errors', () => {
      cy.mount(
        <FieldRoot
          errorMap={VALUE_MISSING_ERROR_MAP}
          label="Custom root"
          name="custom-root"
        >
          <FieldControl>
            {({ fieldControlProps, validityHandlerProps }) => (
              <div
                aria-checked={false}
                data-testid="control"
                role="checkbox"
                tabIndex={0}
                {...fieldControlProps}
                {...validityHandlerProps}
                onInput={(event) =>
                  validityHandlerProps.onInput(event, { valueMissing: true })
                }
              />
            )}
          </FieldControl>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )
      cy.getByTestId('control').trigger('input')
      cy.getByTestId('error').find('p').should('have.length', 0)

      cy.getByTestId('control').focus()
      cy.getByTestId('control').blur()

      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
    })

    it('PRD-027 replaces an earlier reported validity made from another element', () => {
      cy.mount(
        <FieldRoot
          errorMap={VALUE_MISSING_ERROR_MAP}
          errorPolicy={() => true}
          label="Custom root"
          name="custom-root"
        >
          <FieldControl>
            {({ fieldControlProps, validityHandlerProps }) => (
              <div
                data-testid="control"
                role="radiogroup"
                {...fieldControlProps}
                {...validityHandlerProps}
                onInput={(event) =>
                  validityHandlerProps.onInput(event, { valueMissing: true })
                }
              >
                <div
                  aria-checked={false}
                  data-testid="item"
                  role="radio"
                  onClick={(event) => validityHandlerProps.onInput(event, {})}
                >
                  Item
                </div>
              </div>
            )}
          </FieldControl>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )
      cy.getByTestId('control').trigger('input')
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)

      cy.getByTestId('item').click()

      cy.getByTestId('error').find('p').should('have.length', 0)
    })
  })
})

function GroupedInputs(props: {
  inputs: readonly GroupedInput[]
  type: GroupedInputType
}) {
  return (
    <form data-testid="form">
      <FieldRoot
        errorMap={VALUE_MISSING_ERROR_MAP}
        label="Grouped inputs"
        name={GROUPED_NAME}
      >
        <FieldControl>
          {({ fieldControlProps, validityHandlerProps }) => (
            <div
              data-testid="control"
              role={GROUP_ROLES[props.type]}
              {...fieldControlProps}
            >
              {props.inputs.map((input) => (
                <input
                  aria-label={input.value}
                  key={input.value}
                  name={GROUPED_NAME}
                  required={input.isRequired}
                  type={props.type}
                  value={input.value}
                  {...validityHandlerProps}
                />
              ))}
            </div>
          )}
        </FieldControl>
        <ErrorMessage data-testid="error" />
      </FieldRoot>
    </form>
  )
}

function mountGroupedInputs(
  type: GroupedInputType,
  inputs: readonly GroupedInput[],
) {
  return cy.mount(
    <GroupedInputs
      inputs={inputs}
      type={type}
    />,
  )
}

function expectGroupedError() {
  cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
  cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
}

function expectNoGroupedError() {
  cy.getByTestId('error').find('p').should('have.length', 0)
  cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
}
