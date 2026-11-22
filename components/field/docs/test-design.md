# Test design

How each surface is driven, and which boundaries are faked. A test that bypasses this is drift.

- **Surfaces:** `FieldRoot`, `FieldProvider`, `FieldControl`, `Label`, `Description`, and `ErrorMessage`. Each hook is the same contract as its component, pinned by one parity test.
- **Driven by:** Cypress component tests, one spec per surface (`spec/<surface>*.cy.tsx`), that mount `FieldRoot` around a native input or a custom root and act through the browser. `spec/fieldHarness.tsx` holds the shared input control and fixtures.
- **Styles:** `assertStyleHook` sets a style hook on an element and checks the computed style, so tests do not depend on design-token values.
- **Faked:** nothing. Constraint validation, focus, and events are the browser's own.
- **Server rendering and hook parity:** `bun test` with `renderToString` and `hydrateRoot`.
- **Unit (`shared`):** `validityReport`, the event-to-report module every value-control package depends on.
