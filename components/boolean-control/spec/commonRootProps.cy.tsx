import type { ReactNode } from 'react'
import { FieldRoot } from '@maratus-component/field'
import { BooleanControl } from '../src'
import { CUSTOM_CHECKBOX } from './booleanControlField'

// Each root's id comes from the field, so neither takes a common id.
const COMMON_PROP_CASES = [
  {
    control: (props: object) => (
      <BooleanControl {...props}>
        {({ booleanControlProps }) => <input {...booleanControlProps} />}
      </BooleanControl>
    ),
    title: 'GPRD-005 supports common root props on a native checkbox',
  },
  {
    control: (props: object) => (
      <BooleanControl
        {...CUSTOM_CHECKBOX}
        {...props}
      >
        {({ booleanControlProps }) => <div {...booleanControlProps} />}
      </BooleanControl>
    ),
    title: 'GPRD-005 supports common root props on a custom root',
  },
] satisfies {
  control: (props: object) => ReactNode
  title: string
}[]

describe('BooleanControl common root props', () => {
  for (const { control, title } of COMMON_PROP_CASES) {
    it(title, () => {
      // Created once, so re-renders keep the same aliased stubs.
      const props = createCommonRootProps(RELATIONSHIP_ROOT_PROPS)
      cy.mount(
        <FieldRoot
          label="Common props field"
          name="common-props-field"
        >
          {control(props)}
        </FieldRoot>,
      )

      cy.get('[data-common-root-prop="supported"]').assertSupportsProps(
        RELATIONSHIP_ROOT_PROPS,
      )
    })
  }
})
