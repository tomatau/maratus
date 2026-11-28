import type { FieldRootProps, ValidityErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { useState } from 'react'
import { ChoiceControl } from '../src'

const FIELD_NAME = 'radios-field'
const FIELD_LABEL = 'Radios field'
const FIELD_DESCRIPTION = 'Radios field description.'
const FIRST_RADIO = 'first-radio'
const SECOND_RADIO = 'second-radio'
const DISABLED_RADIO = 'disabled-radio'
const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

const RADIOS = [
  { isDisabled: false, value: FIRST_RADIO },
  { isDisabled: false, value: SECOND_RADIO },
  { isDisabled: true, value: DISABLED_RADIO },
]

const ENABLED_RADIOS = [FIRST_RADIO, SECOND_RADIO]

type RadiosFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

describe('ChoiceControl radios mode', () => {
  describe('semantics', () => {
    it('REQ-007 exposes the radiogroup role on the container', () => {
      mountRadios()

      cy.getByTestId('control').should('have.attr', 'role', 'radiogroup')
    })

    it('REQ-008 labels the group with the field label', () => {
      mountRadios()

      cy.getByTestId('control').assertReferences('aria-labelledby', ['label'])
    })

    it('REQ-009 REQ-010 renders radio inputs without an explicit role', () => {
      mountRadios()

      getRadios()
        .should('have.length', RADIOS.length)
        .and('have.prop', 'type', 'radio')
      getRadios().should('not.have.attr', 'role')
    })

    it('REQ-011 REQ-012 shares the field name and keeps each value', () => {
      mountRadios()

      getRadios().each(($radio, index) => {
        expect($radio.prop('name')).to.equal(FIELD_NAME)
        expect($radio.prop('value')).to.equal(RADIOS[index]?.value)
      })
    })

    it('REQ-013 checks only the selected radio', () => {
      mountRadios({ initialValue: FIRST_RADIO })

      cy.getByTestId(FIRST_RADIO).should('be.checked')
      cy.getByTestId(SECOND_RADIO).should('not.be.checked')
    })

    it('REQ-014 REQ-043 marks a required group', () => {
      mountRadios({ fieldState: { isRequired: true } })

      getRadios().should('have.prop', 'required', true)
      cy.getByTestId('control').should('have.attr', 'aria-required', 'true')
    })

    it('REQ-015 disables a disabled radio', () => {
      mountRadios()

      cy.getByTestId(DISABLED_RADIO).should('be.disabled')
    })

    it('REQ-025 references the description from the group', () => {
      mountRadios()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })
  })

  describe('readonly', () => {
    beforeEach(() => {
      mountRadios({ fieldState: { isReadOnly: true } })
    })

    it('REQ-026 omits the readonly attribute on radios', () => {
      getRadios().should('not.have.attr', 'readonly')
    })

    it('REQ-027 sets aria-readonly on the group', () => {
      cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-052 keeps enabled radios enabled', () => {
      for (const radio of ENABLED_RADIOS) {
        cy.getByTestId(radio).should('be.enabled')
      }
    })
  })

  describe('loading', () => {
    beforeEach(() => {
      mountRadios({ fieldState: { isLoading: true } })
    })

    it('REQ-032 REQ-036 marks the group busy and disabled', () => {
      cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
      cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-035 disables every radio', () => {
      getRadios().should('be.disabled')
    })
  })

  describe('errors', () => {
    beforeEach(() => {
      mountRadios({ fieldState: { isRequired: true } })
      cy.getByTestId('form').checkFormValidity()
    })

    it('PRD-014 REQ-050 REQ-051 exposes a browser-detected error on the group', () => {
      cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
    })

    it('PRD-014 REQ-053 clears the error once a radio is selected', () => {
      cy.getByTestId(FIRST_RADIO).check()

      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })

  describe('interaction', () => {
    it('REQ-021 moves the selection on pointer activation', () => {
      mountRadios({ initialValue: FIRST_RADIO })

      cy.getByTestId(SECOND_RADIO).click()

      cy.getByTestId(SECOND_RADIO).should('be.checked')
      cy.getByTestId(FIRST_RADIO).should('not.be.checked')
    })

    it('REQ-022 selects an enabled radio with the keyboard', () => {
      mountRadios({ initialValue: FIRST_RADIO })

      cy.getByTestId(FIRST_RADIO).focus().realPress('ArrowRight')

      cy.getByTestId(SECOND_RADIO).should('be.checked')
      cy.getByTestId(SECOND_RADIO).realPress('ArrowLeft')
      cy.getByTestId(FIRST_RADIO).should('be.checked')
    })

    it('REQ-023 does not select a disabled radio on click', () => {
      mountRadios()

      cy.getByTestId(DISABLED_RADIO).realClick()

      cy.getByTestId(DISABLED_RADIO).should('not.be.checked')
    })

    it('REQ-024 skips the disabled radio during keyboard selection', () => {
      mountRadios({ initialValue: SECOND_RADIO })

      cy.getByTestId(SECOND_RADIO).focus().realPress('ArrowRight')

      cy.getByTestId(FIRST_RADIO).should('be.checked')
      cy.getByTestId(DISABLED_RADIO).should('not.be.checked')
    })
  })

  describe('accessibility', () => {
    it('REQ-007 REQ-008 REQ-009 REQ-010 REQ-027 REQ-043 PRD-002 has no violations', () => {
      mountRadios({
        fieldState: { isReadOnly: true, isRequired: true },
        initialValue: FIRST_RADIO,
      })

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })
})

function RadiosField(props: {
  fieldState: RadiosFieldState
  initialValue: string | null
}) {
  const [value, setValue] = useState(props.initialValue)

  return (
    <form data-testid="form">
      <FieldRoot
        description={FIELD_DESCRIPTION}
        errorMap={ERROR_MAP}
        label={FIELD_LABEL}
        name={FIELD_NAME}
        {...props.fieldState}
      >
        <Label data-testid="label" />
        <ChoiceControl
          mode="radios"
          onChange={(event) => setValue(event.currentTarget.value)}
        >
          {({ choiceControlProps, getChoiceInputProps }) => (
            <div
              data-testid="control"
              {...choiceControlProps}
            >
              {RADIOS.map((radio) => (
                <label key={radio.value}>
                  <input
                    data-testid={radio.value}
                    {...getChoiceInputProps({
                      checked: value === radio.value,
                      isDisabled: radio.isDisabled,
                      value: radio.value,
                    })}
                  />
                  {radio.value}
                </label>
              ))}
            </div>
          )}
        </ChoiceControl>
        <Description data-testid="description" />
        <ErrorMessage data-testid="error" />
      </FieldRoot>
    </form>
  )
}

function mountRadios(
  options: { fieldState?: RadiosFieldState; initialValue?: string } = {},
) {
  cy.mount(
    <RadiosField
      fieldState={options.fieldState ?? {}}
      initialValue={options.initialValue ?? null}
    />,
  )
}

function getRadios() {
  return cy.getByTestId('control').find('input')
}
