import type { ValidityErrorKey, ValidityReport } from './Field.types'

// Native ValidityState objects are live, so a radio checked after its
// sibling reported still clears that sibling's valueMissing.
export type ValidityReports = Map<ValidityReport['reporter'], ValidityState>

// Reported validity describes the whole control, so every report shares one key.
export const CONTROL_REPORTER = Symbol('control')

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
  if (report.validity) reports.set(report.reporter, report.validity)
  pruneDisconnectedReporters(reports)
}

export function pruneDisconnectedReporters(reports: ValidityReports): boolean {
  let removed = false
  for (const reporter of reports.keys()) {
    if (isDisconnected(reporter)) {
      reports.delete(reporter)
      removed = true
    }
  }
  return removed
}

function isDisconnected(reporter: ValidityReport['reporter']): boolean {
  if (typeof reporter === 'symbol') return false

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
