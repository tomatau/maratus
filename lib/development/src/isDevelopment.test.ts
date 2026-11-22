import { afterEach, describe, expect, test } from 'bun:test'
import * as entryPoint from './index'
import { isDevelopment } from './index'

const ORIGINAL_PROCESS = globalThis.process
const ORIGINAL_NODE_ENV = process.env.NODE_ENV

const ENVIRONMENT_CASES = [
  { isDevelopmentBuild: false, nodeEnv: 'production', requirement: 'PRD-002' },
  { isDevelopmentBuild: true, nodeEnv: 'development', requirement: 'PRD-004' },
  { isDevelopmentBuild: true, nodeEnv: 'test', requirement: 'PRD-004' },
]

describe(isDevelopment, () => {
  afterEach(() => {
    globalThis.process = ORIGINAL_PROCESS
    process.env.NODE_ENV = ORIGINAL_NODE_ENV
  })

  test('PRD-001 exports the helpers from the entry point', () => {
    expect([...Object.keys(entryPoint)].sort()).toEqual([
      'isDevelopment',
      'warnInDevelopment',
    ])
  })

  test('PRD-003 treats a missing process global as not development', () => {
    Reflect.deleteProperty(globalThis, 'process')

    expect(isDevelopment()).toBe(false)
  })

  test('PRD-004 treats an unset NODE_ENV as development', () => {
    delete process.env.NODE_ENV

    expect(isDevelopment()).toBe(true)
  })

  for (const {
    isDevelopmentBuild,
    nodeEnv,
    requirement,
  } of ENVIRONMENT_CASES) {
    test(`${requirement} treats NODE_ENV ${nodeEnv} as development: ${isDevelopmentBuild}`, () => {
      process.env.NODE_ENV = nodeEnv

      expect(isDevelopment()).toBe(isDevelopmentBuild)
    })
  }
})
