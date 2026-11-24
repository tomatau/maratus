# Props Requirements

## Scope

### Surfaces

- `mergeRefs`
- `omitPropWithWarning`
- `omitProps`
- `suppressActivation`

### Current scope

- Merging refs onto one element.
- Omitting props, with an optional development warning.
- Suppressing consumer activation handlers.

### Potential scope

- Composing event handlers in a documented order.

## Product Requirements

### Entry point

| ID      | Requirement                                                                                                    | Surfaces | Applicability |
| ------- | -------------------------------------------------------------------------------------------------------------- | -------- | ------------- |
| PRD-001 | Export `mergeRefs`, `omitPropWithWarning`, `omitProps`, and `suppressActivation` from the package entry point. |          | Current       |

### mergeRefs

| ID      | Requirement                                                                                                                                                                         | Surfaces  | Applicability |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ------------- |
| PRD-002 | `mergeRefs` must attach the element to every given ref: it calls a callback ref with the element and sets an object ref's `current` to it.                                          | mergeRefs | Current       |
| PRD-003 | When the element detaches, `mergeRefs` must release every given ref: it runs the cleanup a callback ref returned, or else calls it with `null`, and resets an object ref to `null`. | mergeRefs | Current       |
| PRD-004 | `mergeRefs` must skip a missing ref, given as `undefined` or `null`.                                                                                                                | mergeRefs | Current       |

### omitProps

| ID      | Requirement                                                                                                                                                                    | Surfaces  | Applicability |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ------------- |
| PRD-005 | `omitProps` must return the props without the given keys, whether they are string, number, or symbol keys.                                                                     | omitProps | Current       |
| PRD-006 | `omitProps` must keep every other own enumerable prop, string or symbol keyed, with its value kept by reference whatever its type, and must not change the given props object. | omitProps | Current       |

### omitPropWithWarning

| ID      | Requirement                                                                                                                                               | Surfaces            | Applicability |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------- |
| PRD-007 | When the given prop is present, `omitPropWithWarning` must return the props without it, as `omitProps` does, and pass the message to `warnInDevelopment`. | omitPropWithWarning | Current       |
| PRD-008 | When the given prop is absent, `omitPropWithWarning` must return the same props object and not warn.                                                      | omitPropWithWarning | Current       |

### suppressActivation

| ID      | Requirement                                                                                                                                                | Surfaces           | Applicability |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------- |
| PRD-009 | When suppressed, `suppressActivation` must drop the pointer activation handlers: `onClick`, `onMouseDown`, `onPointerDown`, and `onTouchStart`.            | suppressActivation | Current       |
| PRD-010 | When suppressed, `suppressActivation` must keep `onKeyDown` and `onKeyUp` but skip Enter and Space, preventing their default, and pass every other key on. | suppressActivation | Current       |
| PRD-011 | When not suppressed, `suppressActivation` must return the same props object.                                                                               | suppressActivation | Current       |

## API Contract

```ts
// Pointer handlers are dropped and key handlers wrapped when suppressed.
type ActivationHandlers = {
  onClick?: unknown
  onKeyDown?: (event: React.KeyboardEvent<never>) => void
  onKeyUp?: (event: React.KeyboardEvent<never>) => void
  onMouseDown?: unknown
  onPointerDown?: unknown
  onTouchStart?: unknown
}

function mergeRefs<TElement>(
  ...refs: readonly (React.Ref<TElement> | undefined)[]
): React.RefCallback<TElement>

function omitProps<TProps extends object, TKey extends PropertyKey>(
  props: TProps,
  keys: readonly TKey[],
): Omit<TProps, TKey>

function omitPropWithWarning<TProps extends object, TKey extends string>(
  props: TProps,
  key: TKey,
  message: string,
): Omit<TProps, TKey>

function suppressActivation<TProps extends ActivationHandlers>(
  props: TProps,
  isSuppressed: boolean,
): TProps
```

- `mergeRefs` returns a new callback on each call, so a caller that needs a stable ref memoises it.
- `omitProps` copies the way object spread does: own enumerable string and symbol keys, with values kept by reference. Inherited and non-enumerable props are left out.
- `omitPropWithWarning` relies on `warnInDevelopment` from `@maratus-lib/development` to decide whether a warning is logged.
- `suppressActivation` leaves focus and other keys to the consumer, so arrow-key navigation still works while activation is suppressed.
