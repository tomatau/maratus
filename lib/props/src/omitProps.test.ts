import { describe, expect, test } from 'bun:test'
import { omitProps } from './index'

const SYMBOL_KEY = Symbol('symbol-key')
const OMITTED_SYMBOL_KEY = Symbol('omitted-symbol-key')

// Every value type a props object can hold, so each one is checked to
// survive the copy as the same value.
const KEPT_VALUES = {
  array: ['first', 'second'],
  bigint: 1n,
  boolean: false,
  function: () => 'handler',
  null: null,
  number: 0,
  object: { nested: true },
  string: '',
  symbolValue: Symbol('value'),
  undefined: undefined,
}

describe(omitProps, () => {
  test('PRD-005 removes the given string and symbol keys', () => {
    const props = { [OMITTED_SYMBOL_KEY]: true, id: 'item', readOnly: true }

    const remainingProps = omitProps(props, ['readOnly', OMITTED_SYMBOL_KEY])

    expect(Reflect.ownKeys(remainingProps)).toEqual(['id'])
  })

  test('PRD-005 matches a numeric key to its string key', () => {
    const props = { 1: 'first', id: 'item' }

    expect(omitProps(props, [1])).toEqual({ id: 'item' })
  })

  for (const [type, value] of Object.entries(KEPT_VALUES)) {
    test(`PRD-006 keeps a ${type} value as the same value`, () => {
      const props = { kept: value, readOnly: true }

      expect(omitProps(props, ['readOnly']).kept).toBe(value)
    })
  }

  test('PRD-006 keeps symbol-keyed props', () => {
    const props = { [SYMBOL_KEY]: 'symbol', readOnly: true }

    expect(omitProps(props, ['readOnly'])[SYMBOL_KEY]).toBe('symbol')
  })

  test('PRD-006 leaves out non-enumerable and inherited props, as spread does', () => {
    const props = Object.create(
      { inherited: true },
      {
        hidden: { enumerable: false, value: true },
        shown: { enumerable: true, value: true },
      },
    ) as object

    expect(omitProps(props, [])).toEqual({ ...props })
  })

  test('PRD-006 leaves the given props unchanged', () => {
    const props = { id: 'item', readOnly: true }

    omitProps(props, ['readOnly'])

    expect(props).toEqual({ id: 'item', readOnly: true })
  })
})
