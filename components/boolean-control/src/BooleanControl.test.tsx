import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { BooleanControl } from './BooleanControl'

describe(BooleanControl, () => {
  test('REQ-002 REQ-003 REQ-004 PRD-004 renders field-controlled native boolean props on the server', () => {
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
