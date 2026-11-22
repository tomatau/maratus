import type { ReactNode } from 'react'
import { FieldRoot } from '@maratus-component/field'
import { ChoicesControl } from '../src'

const FIRST_CHOICE = 'first-choice'

// The hook routes focus and blur handlers to each checkbox, as validity
// handlers, so the group root case leaves them out.
const GROUP_ROOT_PROPS = withoutHandlers(RELATIONSHIP_ROOT_PROPS, [
  'onBlur',
  'onFocus',
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
    commonProps: GROUP_ROOT_PROPS,
    control: (props: object) => (
      <ChoicesControl
        mode="checkboxes"
        {...props}
      >
        {({ choicesControlProps }) => (
          <div {...choicesControlProps}>{FIRST_CHOICE}</div>
        )}
      </ChoicesControl>
    ),
    title: 'GPRD-005 supports common root props on a checkbox group',
  },
  {
    commonProps: RELATIONSHIP_ROOT_PROPS,
    control: (props: object) => (
      <ChoicesControl
        mode="checkbox-items"
        {...props}
      >
        {({ choicesControlProps }) => <div {...choicesControlProps} />}
      </ChoicesControl>
    ),
    title: 'GPRD-005 supports common root props on a custom root',
  },
  {
    commonProps: NATIVE_INPUT_PROPS,
    control: (props: object) => (
      <ChoicesControl mode="checkboxes">
        {({ choicesControlProps, getChoicesInputProps }) => (
          <div {...choicesControlProps}>
            <input
              {...getChoicesInputProps({
                ...props,
                value: FIRST_CHOICE,
              })}
            />
          </div>
        )}
      </ChoicesControl>
    ),
    title: 'GPRD-005 supports common root props on a native checkbox',
  },
  {
    commonProps: COMMON_ROOT_PROPS,
    control: (props: object) => (
      <ChoicesControl mode="listbox">
        {({ choicesControlProps, getChoicesItemProps }) => (
          <div {...choicesControlProps}>
            <div
              {...getChoicesItemProps({
                ...props,
                isSelected: false,
              })}
            >
              {FIRST_CHOICE}
            </div>
          </div>
        )}
      </ChoicesControl>
    ),
    title: 'GPRD-005 supports common root props on a custom item',
  },
] satisfies {
  commonProps: Cypress.CommonRootProps
  control: (props: object) => ReactNode
  title: string
}[]

describe('ChoicesControl common root props', () => {
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
