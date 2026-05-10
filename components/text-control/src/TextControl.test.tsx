import { describe, expect, test } from 'bun:test'
import { FieldRoot } from '@maratus-component/field'
import { renderToString } from 'react-dom/server'
import { TextControl } from './TextControl'

describe(TextControl, () => {
  test('REQ-002 REQ-003 PRD-004 renders field-controlled native text props on the server', () => {
    const html = renderToString(
      <FieldRoot
        isRequired
        label="Email"
        name="email"
      >
        <TextControl>
          {({ textControlProps }) => <input {...textControlProps} />}
        </TextControl>
      </FieldRoot>,
    )

    expect(html).toContain('name="email"')
    expect(html).toContain('required=""')
  })
})
