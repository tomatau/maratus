# Shared Requirements

This document defines cross-cutting requirements that apply to all packages under:

- `components/`
- `lib/`

Package-local requirements remain in each package’s own `requirements.md`.

## Scope

These requirements cover shared product and non-functional expectations that should hold across components and libs, especially where behaviour is implemented through common infrastructure or repeated patterns.

## Global Product Requirements

| ID       | Level | Requirement                                                                                                                       | Source         | Applicability |
| -------- | ----- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| GPRD-001 | MUST  | Components that support root substitution MUST expose the substitution prop as `as`.                                              | Library policy | Current       |
| GPRD-002 | MUST  | A component `as` prop MUST accept either an intrinsic element name string or a React component value.                             | Library policy | Current       |
| GPRD-003 | MUST  | Hooks that shape semantics differently for native and non-native roots MUST expose an `isNative` option and default it to `true`. | Library policy | Current       |

## Non-Functional Requirements

| ID      | Level | Requirement                                                                                                                                                                                              | Source         | Applicability |
| ------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| NFR-001 | MUST  | Shared global behaviour that is coordinated through document-level or window-level event listeners MUST attach at most one listener set per runtime instance when one shared listener set is sufficient. | Library policy | Current       |
| NFR-002 | MUST  | Shared selector-based state consumption MUST avoid unnecessary re-renders when a state update does not change the selected value observed by the current consumer.                                       | Library policy | Current       |

## Notes

- These requirements are intended to be testable.
- Package-level specs may reference these IDs when validating shared behaviour.
- Additional package-specific performance, accessibility, or API requirements should remain in the relevant package `requirements.md`.
