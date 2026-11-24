# Development Requirements

## Scope

### Surfaces

- `isDevelopment`
- `warnInDevelopment`

### Current scope

- Detecting a development build.
- Development-only warnings.

### Potential scope

- Development-only invariants.

## Product Requirements

### Entry point

| ID      | Requirement                                                                  | Surfaces | Applicability |
| ------- | ---------------------------------------------------------------------------- | -------- | ------------- |
| PRD-001 | Export `isDevelopment` and `warnInDevelopment` from the package entry point. |          | Current       |

### isDevelopment

| ID      | Requirement                                                                                          | Surfaces      | Applicability |
| ------- | ---------------------------------------------------------------------------------------------------- | ------------- | ------------- |
| PRD-002 | `isDevelopment` must return `false` when `process.env.NODE_ENV` is `production`.                     | isDevelopment | Current       |
| PRD-003 | `isDevelopment` must return `false` when no `process` global exists, as without a bundler.           | isDevelopment | Current       |
| PRD-004 | `isDevelopment` must return `true` for any other `process.env.NODE_ENV`, including when it is unset. | isDevelopment | Current       |

### warnInDevelopment

| ID      | Requirement                                                                                        | Surfaces          | Applicability |
| ------- | -------------------------------------------------------------------------------------------------- | ----------------- | ------------- |
| PRD-005 | When `isDevelopment` returns `true`, `warnInDevelopment` must log its message with `console.warn`. | warnInDevelopment | Current       |
| PRD-006 | When `isDevelopment` returns `false`, `warnInDevelopment` must log nothing.                        | warnInDevelopment | Current       |

## API Contract

```ts
function isDevelopment(): boolean

function warnInDevelopment(message: string): void
```

- `isDevelopment` reads `process.env.NODE_ENV` as written, so a bundler can replace it at build time and drop development-only code.
- `isDevelopment` declares `process` inside its own module, so consumers need no Node type definitions.
- `warnInDevelopment` warns on every call; it does not deduplicate messages.
