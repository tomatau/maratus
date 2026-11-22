# Test design

How each surface is driven, and which boundaries are faked. A test that bypasses this is drift.

- **Surfaces:** `isDevelopment` and `warnInDevelopment`.
- **Driven by:** `bun test`, calling each function through the package entry point.
- **Faked:** `process.env.NODE_ENV` is set per test, and the `process` global is removed for the no-bundler case. `console.warn` is spied on and silenced.
- **No Cypress:** neither surface renders, so the template's component test setup is removed.
