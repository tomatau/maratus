import { beforeEach, describe, expect, mock, test } from 'bun:test'

// The development check belongs to warnInDevelopment and is tested there, so
// this stubs it and checks only what omitPropWithWarning asks of it.
const warnInDevelopment = mock()
mock.module('@maratus-lib/development', () => ({ warnInDevelopment }))

const { omitPropWithWarning } = await import('./index')

const WARNING = 'readOnly does not apply here.'

describe('omitPropWithWarning', () => {
  beforeEach(() => {
    warnInDevelopment.mockClear()
  })

  test('PRD-007 removes a present prop', () => {
    const props = omitPropWithWarning(
      { id: 'item', readOnly: true },
      'readOnly',
      WARNING,
    )

    expect(props).toEqual({ id: 'item' })
  })

  test('PRD-007 passes the message to warnInDevelopment for a present prop', () => {
    omitPropWithWarning({ readOnly: true }, 'readOnly', WARNING)

    expect(warnInDevelopment).toHaveBeenCalledWith(WARNING)
  })

  test('PRD-008 returns the props unchanged without warning when the prop is absent', () => {
    const props = { id: 'item' }

    expect(omitPropWithWarning(props, 'readOnly', WARNING)).toBe(props)
    expect(warnInDevelopment).not.toHaveBeenCalled()
  })
})
