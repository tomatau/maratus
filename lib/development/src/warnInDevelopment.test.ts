import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test'
import { warnInDevelopment } from './index'

const WARNING = 'Development warning.'

const ORIGINAL_NODE_ENV = process.env.NODE_ENV

describe(warnInDevelopment, () => {
  let warn: ReturnType<typeof spyOn>

  beforeEach(() => {
    warn = spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
    process.env.NODE_ENV = ORIGINAL_NODE_ENV
  })

  test('PRD-005 warns in development', () => {
    process.env.NODE_ENV = 'development'

    warnInDevelopment(WARNING)

    expect(warn).toHaveBeenCalledWith(WARNING)
  })

  test('PRD-006 stays silent in production', () => {
    process.env.NODE_ENV = 'production'

    warnInDevelopment(WARNING)

    expect(warn).not.toHaveBeenCalled()
  })
})
