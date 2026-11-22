import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { ChoicesControl } from './ChoicesControl'
import * as entryPoint from './index'

describe(ChoicesControl, () => {
  test('PRD-001 exports the component and hook from the entry point', () => {
    expect([...Object.keys(entryPoint)].sort()).toEqual([
      'ChoicesControl',
      'useChoicesControl',
    ])
  })

  test('PRD-004 renders native checkbox props on the server', () => {
    const html = renderToString(
      <FieldRoot
        isRequired
        label="Checkboxes field"
        name="checkboxes-field"
      >
        <ChoicesControl mode="checkboxes">
          {({ choicesControlProps, getChoicesInputProps }) => (
            <div {...choicesControlProps}>
              <input
                {...getChoicesInputProps({
                  defaultChecked: true,
                  value: 'first-choice',
                })}
              />
            </div>
          )}
        </ChoicesControl>
      </FieldRoot>,
    )

    expect(html).toContain('role="group"')
    expect(html).toContain('name="checkboxes-field"')
    expect(html).toContain('checked=""')
    expect(html).not.toContain('aria-required')
  })
})
