import type { FieldErrorKey, FieldErrorPolicy } from '../src'
import { expectErrorMessages, mountPolicyField } from './fieldHarness'

type Stub = sinon.SinonStub

type FieldErrorPolicyArgs = Parameters<FieldErrorPolicy>[0]

const VALUE_MISSING_TEXT = 'Enter an email address.'

const ERROR_MAP = new Map<FieldErrorKey, string>([
  ['valueMissing', VALUE_MISSING_TEXT],
  ['typeMismatch', 'Enter a valid email address.'],
])

const ACTIVE_ERRORS = new Set<FieldErrorKey>(['valueMissing', 'typeMismatch'])

describe('FieldRoot errorPolicy state', () => {
  it('PRD-008 PRD-009 PRD-010 PRD-011 passes initial policy state for controlled active errors', () => {
    const errorPolicy = cy.stub().returns(true)

    mountPolicyField({
      activeErrors: ACTIVE_ERRORS,
      errorMap: ERROR_MAP,
      errorPolicy,
    })

    cy.wrap(errorPolicy).should((policy: Stub) => {
      const args = lastPolicyArgs(policy, 'invalid')
      expect(args).to.include({
        activeErrors: ACTIVE_ERRORS,
        isErrorVisible: false,
        isValid: false,
      })
      expect(args.field).to.deep.equal({
        wasBlurred: false,
        wasChanged: false,
        wasErrored: false,
        wasTouched: false,
      })
      expect(args.form).to.deep.equal({ wasSubmitted: false })
    })
  })

  it('PRD-008 PRD-009 PRD-010 passes invalid event policy state for native validation', () => {
    const errorPolicy = cy.stub().returns(true)
    mountPolicyField({
      errorMap: ERROR_MAP,
      errorPolicy,
      input: { required: true },
    })

    checkControlValidity()

    expectErrorMessages([VALUE_MISSING_TEXT])
    cy.wrap(errorPolicy).should((policy: Stub) => {
      const args = lastPolicyArgs(policy, 'invalid')
      expect(args).to.include({ isErrorVisible: true, isValid: false })
      expect(args.field).to.deep.equal({
        wasBlurred: false,
        wasChanged: false,
        wasErrored: true,
        wasTouched: true,
      })
    })
  })

  it('PRD-008 PRD-009 PRD-010 passes input event policy state after a visible error', () => {
    const errorPolicy = cy.stub().returns(true)
    mountPolicyField({
      errorMap: ERROR_MAP,
      errorPolicy,
      input: { required: true },
    })
    checkControlValidity()
    expectErrorMessages([VALUE_MISSING_TEXT])

    cy.getByTestId('control').invoke('val', 'a').trigger('input')

    cy.wrap(errorPolicy).should((policy: Stub) => {
      const args = lastPolicyArgs(policy, 'input')
      expect(args).to.include({ isErrorVisible: false, isValid: true })
      expect(args.field).to.deep.equal({
        wasBlurred: false,
        wasChanged: true,
        wasErrored: true,
        wasTouched: true,
      })
    })
  })

  it('PRD-008 PRD-010 marks the field as blurred after focus leaves the control', () => {
    const errorPolicy = cy.stub().returns(false)
    mountPolicyField({ errorMap: ERROR_MAP, errorPolicy })

    cy.getByTestId('control').trigger('focusin')
    cy.getByTestId('control').trigger('focusout')

    cy.wrap(errorPolicy).should((policy: Stub) => {
      expect(lastPolicyArgs(policy, 'blur').field).to.include({
        wasBlurred: true,
      })
    })
  })

  it('PRD-008 PRD-010 marks the field as touched when the control receives focus', () => {
    const errorPolicy = cy.stub().returns(false)
    mountPolicyField({ errorMap: ERROR_MAP, errorPolicy })

    cy.getByTestId('control').focus()

    cy.wrap(errorPolicy).should((policy: Stub) => {
      expect(lastPolicyArgs(policy, 'focus').field).to.include({
        wasTouched: true,
      })
    })
  })

  it('PRD-008 PRD-010 passes change event policy state for native checkbox changes', () => {
    const errorPolicy = cy.stub().returns(true)
    mountPolicyField({
      errorMap: ERROR_MAP,
      errorPolicy,
      input: { required: true, type: 'checkbox' },
    })
    checkControlValidity()
    expectErrorMessages([VALUE_MISSING_TEXT])

    cy.getByTestId('control').check()

    cy.wrap(errorPolicy).should((policy: Stub) => {
      const args = firstPolicyArgs(policy, 'change')
      expect(args).to.include({ isErrorVisible: true, isValid: true })
      expect(args.field).to.include({ wasChanged: true, wasTouched: true })
    })
  })
})

function checkControlValidity() {
  cy.getByTestId<HTMLInputElement>('control').then(($control) => {
    $control.get(0).checkValidity()
  })
}

function firstPolicyArgs(
  errorPolicy: Stub,
  event: FieldErrorPolicyArgs['event'],
): FieldErrorPolicyArgs {
  return expectPolicyArgs(policyArgsFor(errorPolicy, event)[0], event)
}

function lastPolicyArgs(
  errorPolicy: Stub,
  event: FieldErrorPolicyArgs['event'],
): FieldErrorPolicyArgs {
  return expectPolicyArgs(policyArgsFor(errorPolicy, event).at(-1), event)
}

function policyArgsFor(
  errorPolicy: Stub,
  event: FieldErrorPolicyArgs['event'],
): FieldErrorPolicyArgs[] {
  return errorPolicy
    .getCalls()
    .map(({ args }) => args[0] as FieldErrorPolicyArgs)
    .filter((args) => args.event === event)
}

function expectPolicyArgs(
  args: FieldErrorPolicyArgs | undefined,
  event: FieldErrorPolicyArgs['event'],
): FieldErrorPolicyArgs {
  expect(args, `${event} policy call`).to.not.equal(undefined)

  return args as FieldErrorPolicyArgs
}
