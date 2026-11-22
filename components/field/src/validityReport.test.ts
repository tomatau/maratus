// unit: shared
import { describe, expect, test } from 'bun:test'
import { CONTROL_REPORTER } from './fieldValidity'
import { getValidityReport } from './validityReport'

const VALUE_MISSING = { valueMissing: true }

describe(getValidityReport, () => {
  test('reports a given validity for the whole control', () => {
    const event = { currentTarget: document.createElement('div') }

    const report = getValidityReport(event, VALUE_MISSING)

    expect(report).toEqual({
      reporter: CONTROL_REPORTER,
      validity: expect.objectContaining({ valid: false, valueMissing: true }),
    })
  })

  test("reports a native input's own ValidityState", () => {
    const input = document.createElement('input')
    input.required = true

    const report = getValidityReport({ currentTarget: input }, undefined)

    expect(report).toEqual({ reporter: input, validity: input.validity })
  })

  test('reports only field history for an element without a ValidityState', () => {
    const root = document.createElement('div')

    const report = getValidityReport({ currentTarget: root }, undefined)

    expect(report).toEqual({ reporter: root, validity: null })
  })
})
