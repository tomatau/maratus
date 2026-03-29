# Shared Requirements

This document defines cross-cutting requirements that apply to all packages under:

- `components/`
- `lib/`

Package-local requirements remain in each package’s own `requirements.md`.

## Scope

These requirements cover shared non-functional expectations that should hold across components and libs, especially where behaviour is implemented through common infrastructure or repeated patterns.

## Requirement Matrix

| ID      | Level | Requirement                                                                                                                                                                                              | Source         | Applicability |
| ------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------- |
| NFR-001 | MUST  | Shared global behaviour that is coordinated through document-level or window-level event listeners MUST attach at most one listener set per runtime instance when one shared listener set is sufficient. | Library policy | Current       |
| NFR-002 | MUST  | Shared selector-based state consumption MUST avoid unnecessary re-renders when a state update does not change the selected value observed by the current consumer.                                       | Library policy | Current       |

## Notes

- These requirements are intended to be testable.
- Package-level specs may reference these IDs when validating shared behaviour.
- Additional package-specific performance, accessibility, or API requirements should remain in the relevant package `requirements.md`.
