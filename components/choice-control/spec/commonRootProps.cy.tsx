import type { ReactNode } from 'react'
import { FieldRoot } from '@maratus-component/field'
import { ChoiceControl } from '../src'

const FIRST_CHOICE = 'first-choice'

// Cypress cannot click a select, so its case leaves out the click handlers.
const SELECT_ROOT_PROPS = withoutHandlers(RELATIONSHIP_ROOT_PROPS, [
  'onClick',
  'onClickCapture',
])

// Native inputs take focus and blur handlers on the hook, as validity
// handlers, so their per-input case leaves them out.
const NATIVE_INPUT_PROPS = withoutHandlers(COMMON_ROOT_PROPS, [
  'onBlur',
  'onFocus',
])

// Each case passes the common props to one element only.
const COMMON_PROP_CASES = [
  {
    commonProps: SELECT_ROOT_PROPS,
    control: (props: object) => (
      <ChoiceControl
        mode="select"
        {...props}
      >
        {({ choiceControlProps }) => (
          <select {...choiceControlProps}>
            <option value={FIRST_CHOICE}>{FIRST_CHOICE}</option>
          </select>
        )}
      </ChoiceControl>
    ),
    title: 'GPRD-005 supports common root props on a select',
  },
  {
    commonProps: RELATIONSHIP_ROOT_PROPS,
    control: (props: object) => (
      <ChoiceControl
        mode="radio-items"
        {...props}
      >
        {({ choiceControlProps }) => <div {...choiceControlProps} />}
      </ChoiceControl>
    ),
    title: 'GPRD-005 supports common root props on a custom root',
  },
  {
    commonProps: NATIVE_INPUT_PROPS,
    control: (props: object) => (
      <ChoiceControl mode="radios">
        {({ choiceControlProps, getChoiceInputProps }) => (
          <div {...choiceControlProps}>
            <input
              {...getChoiceInputProps({
                ...props,
                value: FIRST_CHOICE,
              })}
            />
          </div>
        )}
      </ChoiceControl>
    ),
    title: 'GPRD-005 supports common root props on a native radio',
  },
  {
    commonProps: COMMON_ROOT_PROPS,
    control: (props: object) => (
      <ChoiceControl mode="listbox">
        {({ choiceControlProps, getChoiceItemProps }) => (
          <div {...choiceControlProps}>
            <div
              {...getChoiceItemProps({
                ...props,
                isSelected: false,
              })}
            >
              {FIRST_CHOICE}
            </div>
          </div>
        )}
      </ChoiceControl>
    ),
    title: 'GPRD-005 supports common root props on a custom item',
  },
] satisfies {
  commonProps: Cypress.CommonRootProps
  control: (props: object) => ReactNode
  title: string
}[]

describe('ChoiceControl common root props', () => {
  for (const { commonProps, control, title } of COMMON_PROP_CASES) {
    it(title, () => {
      // Created once, so re-renders keep the same aliased stubs.
      const props = createCommonRootProps(commonProps)
      cy.mount(
        <FieldRoot
          label="Common props field"
          name="common-props-field"
        >
          {control(props)}
        </FieldRoot>,
      )

      cy.get('[data-common-root-prop="supported"]').assertSupportsProps(
        commonProps,
      )
    })
  }
})

function withoutHandlers(
  commonProps: Cypress.CommonRootProps,
  props: readonly Cypress.CommonRootEventHandler['prop'][],
): Cypress.CommonRootProps {
  return {
    ...commonProps,
    eventHandlers: commonProps.eventHandlers?.filter(
      (handler) => !props.includes(handler.prop),
    ),
  }
}
