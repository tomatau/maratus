import type { ValidityErrorKey, ValidityReport } from './Field.types'

// Native ValidityState objects are live, so a radio checked after its
// sibling reported still clears that sibling's valueMissing.
export type ValidityReports = Map<EventTarget, ValidityState>

export const validityErrorKeys = [
  'badInput',
  'customError',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
] as const satisfies readonly ValidityErrorKey[]

export function recordValidityReport(
  reports: ValidityReports,
  report: ValidityReport,
): void {
  reports.set(report.reporter, report.validity)

  for (const reporter of reports.keys()) {
    if (isDisconnected(reporter)) reports.delete(reporter)
  }
}

function isDisconnected(reporter: EventTarget): boolean {
  return 'isConnected' in reporter && reporter.isConnected === false
}

export function getReportedErrorKeys(
  reports: ValidityReports,
): readonly ValidityErrorKey[] {
  const reportedKeys = new Set(
    [...reports.values()].flatMap((validity) => getValidityErrorKeys(validity)),
  )

  return validityErrorKeys.filter((key) => reportedKeys.has(key))
}

function getValidityErrorKeys(
  validity: ValidityState,
): readonly ValidityErrorKey[] {
  return validity.valid ? [] : validityErrorKeys.filter((key) => validity[key])
}
