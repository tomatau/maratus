# Store Runtime Requirements

## Scope

### Current scope

- Store creation
- Store subscription
- Runtime store lookup
- Selector-based store consumption

### Potential scope

- Provider-based runtime override
- Alternate store backends
- Batched update semantics

## Product Requirements

| ID      | Requirement                                                                                                               | Applicability |
| ------- | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Expose `createStore()` as the low-level writable store primitive for shared runtime-backed state.                         | Current       |
| PRD-002 | Expose `useStoreSelector()` as the selector-based consumption surface for reading store state through React consumers.    | Current       |
| PRD-003 | Selector-based consumers should only observe a logical change when the selected value they read has changed.              | Current       |
| PRD-004 | Expose `createStoreRuntime()` and `useStoreRuntime()` as the shared runtime surface for resolving store instances by key. | Current       |
