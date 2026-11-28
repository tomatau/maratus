import type { FieldRootProps, ValidityErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { useState } from 'react'
import { ChoiceControl } from '../src'

const FIELD_NAME = 'custom-items-field'
const FIELD_LABEL = 'Custom items field'
const FIELD_DESCRIPTION = 'Custom items field description.'
const FIRST_ITEM = 'first-item'
const SECOND_ITEM = 'second-item'
const DISABLED_ITEM = 'disabled-item'
const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

const ITEMS = [
  { disabled: false, value: FIRST_ITEM },
  { disabled: false, value: SECOND_ITEM },
  { disabled: true, value: DISABLED_ITEM },
]

const ENABLED_ITEMS = [FIRST_ITEM, SECOND_ITEM]

type CustomItemsMode = 'listbox' | 'radio-items'

type CustomItemsFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

const CUSTOM_ITEMS_MODES = [
  {
    containerRole: 'listbox',
    itemRole: 'option',
    mode: 'listbox',
    requirements: {
      a11y: 'REQ-016 REQ-017 REQ-018 REQ-019 REQ-044 REQ-049 PRD-003',
      containerRole: 'REQ-016',
      disabledItem: 'REQ-020 PRD-017',
      itemRole: 'REQ-018',
      label: 'REQ-017',
      readOnly: 'REQ-049',
      required: 'REQ-044',
      selection: 'REQ-019',
    },
    selectionAttribute: 'aria-selected',
  },
  {
    containerRole: 'radiogroup',
    itemRole: 'radio',
    mode: 'radio-items',
    requirements: {
      a11y: 'REQ-007 REQ-008 REQ-027 REQ-028 REQ-029 REQ-043 PRD-016',
      containerRole: 'REQ-007',
      disabledItem: 'REQ-030 PRD-017',
      itemRole: 'REQ-028',
      label: 'REQ-008',
      readOnly: 'REQ-027',
      required: 'REQ-043 PRD-016',
      selection: 'REQ-029',
    },
    selectionAttribute: 'aria-checked',
  },
] as const

for (const testCase of CUSTOM_ITEMS_MODES) {
  const { mode, requirements } = testCase

  describe(`ChoiceControl ${mode} mode`, () => {
    describe('semantics', () => {
      it(`${requirements.containerRole} exposes the ${testCase.containerRole} role on the container`, () => {
        mountCustomItems({ mode })

        cy.getByTestId('control').should(
          'have.attr',
          'role',
          testCase.containerRole,
        )
      })

      it(`${requirements.label} labels the container with the field label`, () => {
        mountCustomItems({ mode })

        cy.getByTestId('control').assertReferences('aria-labelledby', ['label'])
      })

      it('REQ-025 references the description from the container', () => {
        mountCustomItems({ mode })

        cy.getByTestId('control').assertReferences('aria-describedby', [
          'description',
        ])
      })

      it(`${requirements.itemRole} gives each item the ${testCase.itemRole} role`, () => {
        mountCustomItems({ mode })

        getItems()
          .should('have.length', ITEMS.length)
          .and('have.attr', 'role', testCase.itemRole)
      })

      it(`${requirements.selection} marks only the selected item with ${testCase.selectionAttribute}`, () => {
        mountCustomItems({ initialValue: FIRST_ITEM, mode })

        cy.getByTestId(FIRST_ITEM).should(
          'have.attr',
          testCase.selectionAttribute,
          'true',
        )
        cy.getByTestId(SECOND_ITEM).should(
          'have.attr',
          testCase.selectionAttribute,
          'false',
        )
      })

      it(`${requirements.disabledItem} marks a disabled item`, () => {
        mountCustomItems({ mode })

        cy.getByTestId(DISABLED_ITEM).should(
          'have.attr',
          'aria-disabled',
          'true',
        )
        cy.getByTestId(DISABLED_ITEM).should('not.have.attr', 'disabled')
      })

      it(`${requirements.required} marks the container required but not its items`, () => {
        mountCustomItems({ fieldState: { isRequired: true }, mode })

        cy.getByTestId('control').should('have.attr', 'aria-required', 'true')
        getItems().should('not.have.attr', 'aria-required')
      })
    })

    describe('readonly', () => {
      beforeEach(() => {
        mountCustomItems({ fieldState: { isReadOnly: true }, mode })
      })

      it(`${requirements.readOnly} sets aria-readonly on the container`, () => {
        cy.getByTestId('control').should('have.attr', 'aria-readonly', 'true')
      })

      it('REQ-052 keeps enabled items enabled', () => {
        for (const item of ENABLED_ITEMS) {
          cy.getByTestId(item).should('not.have.attr', 'aria-disabled')
        }
      })
    })

    describe('loading', () => {
      beforeEach(() => {
        mountCustomItems({ fieldState: { isLoading: true }, mode })
      })

      it('REQ-032 REQ-036 marks the container busy and disabled', () => {
        cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
        cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
      })

      it('REQ-037 marks every item disabled', () => {
        getItems().should('have.attr', 'aria-disabled', 'true')
      })
    })

    describe('errors', () => {
      beforeEach(() => {
        mountCustomItems({ fieldState: { isRequired: true }, mode })
        cy.getByTestId(FIRST_ITEM).focus()
        cy.getByTestId(FIRST_ITEM).blur()
      })

      it('PRD-015 REQ-050 REQ-051 exposes a consumer-reported error on the container', () => {
        cy.getByTestId('error').should('have.text', VALUE_MISSING_MESSAGE)
        cy.getByTestId('control')
          .should('have.attr', 'aria-invalid', 'true')
          .assertReferences('aria-errormessage', ['error'])
      })

      it('PRD-015 REQ-053 clears the error once an item is selected', () => {
        cy.getByTestId(FIRST_ITEM).click()

        cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
        cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
      })
    })

    describe('accessibility', () => {
      it(`${requirements.a11y} has no violations`, () => {
        mountCustomItems({
          fieldState: { isReadOnly: true, isRequired: true },
          initialValue: FIRST_ITEM,
          mode,
        })

        cy.injectAxeAtRoot()
        cy.auditA11y()
      })
    })
  })
}

function CustomItemsField(props: {
  fieldState: CustomItemsFieldState
  initialValue: string | null
  mode: CustomItemsMode
}) {
  const [value, setValue] = useState(props.initialValue)
  const valueMissing = Boolean(props.fieldState.isRequired) && value === null

  return (
    <FieldRoot
      description={FIELD_DESCRIPTION}
      errorMap={ERROR_MAP}
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...props.fieldState}
    >
      <Label data-testid="label" />
      <ChoiceControl mode={props.mode}>
        {({ choiceControlProps, getChoiceItemProps }) => (
          <div
            data-testid="control"
            {...choiceControlProps}
            onBlur={(event) =>
              choiceControlProps.onBlur(event, { valueMissing })
            }
          >
            {ITEMS.map((item) => (
              <div
                data-testid={item.value}
                key={item.value}
                tabIndex={0}
                {...getChoiceItemProps({
                  disabled: item.disabled,
                  isSelected: value === item.value,
                })}
                onClick={(event) => {
                  setValue(item.value)
                  choiceControlProps.onInput(event, {})
                }}
              >
                {item.value}
              </div>
            ))}
          </div>
        )}
      </ChoiceControl>
      <Description data-testid="description" />
      <ErrorMessage data-testid="error" />
    </FieldRoot>
  )
}

function mountCustomItems(options: {
  fieldState?: CustomItemsFieldState
  initialValue?: string
  mode: CustomItemsMode
}) {
  cy.mount(
    <CustomItemsField
      fieldState={options.fieldState ?? {}}
      initialValue={options.initialValue ?? null}
      mode={options.mode}
    />,
  )
}

function getItems() {
  return cy.getByTestId('control').find('[data-testid]')
}
