# Test design

How each surface is driven, and which boundaries are faked. A test that bypasses this is drift.

- **Surfaces:** `ChoicesControl`, one contract per `mode`. `useChoicesControl` is the same contract without the render prop.
- **Driven by:** Cypress component tests per mode. A harness plays the consumer: it owns the value, which this package leaves to consumers, and passes the reported validity to the validity handlers for custom modes.
- **Faked:** nothing. The real `field` package and the browser are used.
- **Shared harness:** a mode table when modes share a contract, and `spec/*Field.tsx` modules when one harness backs several specs. Relationship and form assertions use the shared `assertReferences` and `checkFormValidity` Cypress commands.
- **Server rendering:** `bun test` with `renderToString`.
- **Type contracts:** `src/*.test-d.ts` files, checked by `just typecheck` and never asserted at runtime.
