import type { FieldRootProps, ValidityErrorKey } from '../src'
import type { ReactElement } from 'react'
import { cloneElement } from 'react'
import { FieldControl, FieldRoot, Label } from '../src'

const HOOK_COLOUR = 'rgb(1, 2, 3)'
const HOOK_LENGTH = '7px'
const VALUE_MISSING_ERRORS = new Set<ValidityErrorKey>(['valueMissing'])

type StyledFieldState = Pick<
  FieldRootProps,
  'activeErrors' | 'isReadOnly' | 'isRequired'
>

const STYLE_HOOK_CASES = [
  {
    fieldState: {},
    hook: { property: 'color', value: HOOK_COLOUR, variable: '--ara-field-fg' },
    state: 'foreground',
    testId: 'field',
  },
  {
    fieldState: {},
    hook: {
      property: 'row-gap',
      value: HOOK_LENGTH,
      variable: '--ara-field-spacing',
    },
    state: 'spacing',
    testId: 'field',
  },
  {
    fieldState: { isRequired: true },
    hook: {
      property: 'color',
      pseudo: '::after',
      value: HOOK_COLOUR,
      variable: '--ara-field-required-mark-fg',
    },
    state: 'required',
    testId: 'label',
  },
  {
    fieldState: { isReadOnly: true },
    hook: {
      property: 'color',
      value: HOOK_COLOUR,
      variable: '--ara-field-label-fg--readonly',
    },
    state: 'readonly',
    testId: 'label',
  },
  {
    fieldState: { activeErrors: VALUE_MISSING_ERRORS },
    hook: {
      property: 'border-top-color',
      value: HOOK_COLOUR,
      variable: '--ara-field-control-detail--invalid',
    },
    state: 'invalid',
    testId: 'control',
  },
] satisfies {
  fieldState: StyledFieldState
  hook: Cypress.StyleHook
  state: string
  testId: string
}[]

describe('Field default styles', () => {
  for (const { fieldState, hook, state, testId } of STYLE_HOOK_CASES) {
    it(`PRD-018 styles the ${state} state through ${hook.variable}`, () => {
      mountStyledField(fieldState)

      cy.getByTestId(testId).assertStyleHook(hook)
    })
  }

  const controlForegroundCases = [
    {
      control: <select data-testid="control" />,
      title: 'PRD-018 keeps an editable select on the control foreground',
      variable: '--ara-field-control-fg',
    },
    {
      control: (
        <input
          data-testid="control"
          readOnly
        />
      ),
      title: 'PRD-018 styles a natively readonly input as readonly',
      variable: '--ara-field-control-fg--readonly',
    },
  ] satisfies {
    control: ReactElement<Record<string, unknown>>
    title: string
    variable: Cypress.StyleHook['variable']
  }[]

  for (const { control, title, variable } of controlForegroundCases) {
    it(title, () => {
      cy.mount(
        <FieldRoot
          label="Styled field"
          name="styled-field"
        >
          <FieldControl>
            {({ fieldControlProps }) =>
              cloneElement(control, fieldControlProps)
            }
          </FieldControl>
        </FieldRoot>,
      )

      cy.getByTestId('control').assertStyleHook({
        property: 'color',
        value: HOOK_COLOUR,
        variable,
      })
    })
  }

  it('PRD-018 marks a required label with an asterisk', () => {
    mountStyledField({ isRequired: true })

    cy.getByTestId('label').should(($label) => {
      const { content } = getComputedStyle($label.get(0), '::after')

      expect(content).to.equal('" *"')
    })
  })
})

function mountStyledField(fieldState: StyledFieldState) {
  cy.mount(
    <FieldRoot
      data-testid="field"
      label="Styled field"
      name="styled-field"
      {...fieldState}
    >
      <Label data-testid="label" />
      <FieldControl>
        {({ fieldControlProps, validityHandlerProps }) => (
          <input
            data-testid="control"
            {...fieldControlProps}
            {...validityHandlerProps}
          />
        )}
      </FieldControl>
    </FieldRoot>,
  )
}
