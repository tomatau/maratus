# Test design

How each surface is driven, and which boundaries are faked. A test that bypasses this is drift.

- **Surfaces:** `mergeRefs`, `omitProps`, `omitPropWithWarning`, and `suppressActivation`.
- **Driven by:** `bun test`, calling each function through the package entry point.
- **Faked:** refs and handlers are `mock()` functions or `createRef` objects, key events are plain objects with a `key` and a `preventDefault` mock, and `console.warn` is spied on and silenced.
- **No Cypress:** neither surface renders, so the template's component test setup is removed.
