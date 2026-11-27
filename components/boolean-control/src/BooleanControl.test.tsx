import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { BooleanControl } from './BooleanControl'
import * as entryPoint from './index'

describe(BooleanControl, () => {
  test('PRD-001 exports the component and hook from the entry point', () => {
    expect([...Object.keys(entryPoint)].sort()).toEqual([
      'BooleanControl',
      'useBooleanControl',
    ])
  })

  test('REQ-002 REQ-004 PRD-004 PRD-010 renders field-controlled native boolean props on the server', () => {
    const html = renderToString(
      <FieldRoot
        isRequired
        label="Accept terms"
        name="terms"
      >
        <BooleanControl>
          {({ booleanControlProps }) => <input {...booleanControlProps} />}
        </BooleanControl>
      </FieldRoot>,
    )

    expect(html).toContain('name="terms"')
    expect(html).toContain('required=""')
    expect(html).toContain('type="checkbox"')
  })
})
