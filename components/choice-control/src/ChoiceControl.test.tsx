import type { ReactNode } from 'react'
import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { ChoiceControl } from './ChoiceControl'
import * as entryPoint from './index'

const FIELD_NAME = 'server-field'
const FIRST_CHOICE = 'first-choice'

const SERVER_RENDER_CASES = [
  {
    control: (
      <ChoiceControl mode="select">
        {({ choiceControlProps }) => (
          <select {...choiceControlProps}>
            <option value={FIRST_CHOICE}>First choice</option>
          </select>
        )}
      </ChoiceControl>
    ),
    expectedMarkup: [`name="${FIELD_NAME}"`, 'required=""'],
    mode: 'select',
  },
  {
    control: (
      <ChoiceControl mode="radios">
        {({ choiceControlProps, getChoiceInputProps }) => (
          <div {...choiceControlProps}>
            <input {...getChoiceInputProps({ value: FIRST_CHOICE })} />
          </div>
        )}
      </ChoiceControl>
    ),
    expectedMarkup: [
      'role="radiogroup"',
      'type="radio"',
      `name="${FIELD_NAME}"`,
      'required=""',
    ],
    mode: 'radios',
  },
] satisfies { control: ReactNode; expectedMarkup: string[]; mode: string }[]

describe(ChoiceControl, () => {
  test('PRD-001 exports the component and hook from the entry point', () => {
    expect([...Object.keys(entryPoint)].sort()).toEqual([
      'ChoiceControl',
      'useChoiceControl',
    ])
  })

  for (const { control, expectedMarkup, mode } of SERVER_RENDER_CASES) {
    test(`PRD-009 renders native ${mode} props on the server`, () => {
      const html = renderToString(
        <FieldRoot
          isRequired
          label="Server field"
          name={FIELD_NAME}
        >
          {control}
        </FieldRoot>,
      )

      for (const markup of expectedMarkup) expect(html).toContain(markup)
    })
  }
})
