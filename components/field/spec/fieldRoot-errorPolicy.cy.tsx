import type { FieldErrorKey } from '../src'
import { expectErrorMessages, mountPolicyField } from './fieldHarness'

const VALUE_MISSING_TEXT = 'Enter an email address.'
const TYPE_MISMATCH_TEXT = 'Enter a valid email address.'
const SERVER_ERROR_TEXT = 'This email is already registered.'

const ERROR_MAP = new Map<FieldErrorKey, string>([
  ['valueMissing', VALUE_MISSING_TEXT],
  ['typeMismatch', TYPE_MISMATCH_TEXT],
  ['customServerError', SERVER_ERROR_TEXT],
])

const ACTIVE_ERRORS = new Set<FieldErrorKey>(['valueMissing', 'typeMismatch'])

describe('FieldRoot errorPolicy visibility', () => {
  it('PRD-007 hides active errors when errorPolicy returns false', () => {
    mountPolicyField({
      activeErrors: ACTIVE_ERRORS,
      errorMap: ERROR_MAP,
      errorPolicy: () => false,
    })

    expectErrorMessages([])
    cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
  })

  it('PRD-007 shows all active errors when errorPolicy returns true', () => {
    mountPolicyField({
      activeErrors: ACTIVE_ERRORS,
      errorMap: ERROR_MAP,
      errorPolicy: () => true,
    })

    expectErrorMessages([VALUE_MISSING_TEXT, TYPE_MISMATCH_TEXT])
    cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
  })

  it('PRD-007 shows matching active errors in the order returned by errorPolicy', () => {
    mountPolicyField({
      activeErrors: ACTIVE_ERRORS,
      errorMap: ERROR_MAP,
      errorPolicy: () => ['typeMismatch', 'valueMissing'],
    })

    expectErrorMessages([TYPE_MISMATCH_TEXT, VALUE_MISSING_TEXT])
  })

  it('PRD-007 ignores error keys returned by errorPolicy when they are not active', () => {
    mountPolicyField({
      activeErrors: ACTIVE_ERRORS,
      errorMap: ERROR_MAP,
      errorPolicy: () => ['customServerError', 'typeMismatch'],
    })

    expectErrorMessages([TYPE_MISMATCH_TEXT])
  })

  it('PRD-007 uses the default error policy when no custom errorPolicy is supplied', () => {
    mountPolicyField({
      errorMap: ERROR_MAP,
      errorPolicy: undefined,
      input: { required: true },
    })

    cy.getByTestId('control').trigger('input')
    expectErrorMessages([])

    cy.getByTestId('control').trigger('focusout')
    expectErrorMessages([VALUE_MISSING_TEXT])
    cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')

    cy.getByTestId('control').invoke('val', 'a').trigger('input')
    expectErrorMessages([])
    cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
  })
})
