import type { ValidityReport } from './Field.types'
import { CONTROL_REPORTER, validityErrorKeys } from './fieldValidity'

// Reported validity wins; otherwise the event's element reports its own
// ValidityState, or only field history when it has none.
export function getValidityReport(
  event: { currentTarget: EventTarget },
  validity: Partial<ValidityState> | undefined,
): ValidityReport {
  if (validity) {
    return {
      reporter: CONTROL_REPORTER,
      validity: createValidityState(validity),
    }
  }

  return {
    reporter: event.currentTarget,
    validity: hasValidityState(event.currentTarget)
      ? event.currentTarget.validity
      : null,
  }
}

function hasValidityState(
  target: EventTarget,
): target is EventTarget & { validity: ValidityState } {
  return 'validity' in target
}

function createValidityState(validity: Partial<ValidityState>): ValidityState {
  const errors = Object.fromEntries(
    validityErrorKeys.map((key) => [key, validity[key] ?? false]),
  ) as Record<(typeof validityErrorKeys)[number], boolean>

  return {
    ...errors,
    valid:
      validity.valid ?? validityErrorKeys.every((key) => errors[key] === false),
  }
}
