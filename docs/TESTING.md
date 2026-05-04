# Testing

## Local Commands

- `just test` runs package-level functional test tasks.
- `just test-unit` runs package-level unit test tasks.
- `just test-integration` runs package-level integration test tasks.

## Component Test Structure

- Group larger Cypress specs by behaviour area.
- Use groups such as `accessibility`, `rendering customisation`, `native controls`, `non-native roots`, `controlled state`, and component-specific state domains.
- Keep requirement IDs in test names for traceability.
- Avoid long flat specs when groups improve navigation or failure diagnosis.
- Keep tests focused on one behaviour path unless a short sequence proves the behaviour.

## Common Root Prop Tests

- Use shared Cypress helpers for common root prop support.
- Build props with `createCommonRootProps(...)` from one test-owned definition.
- Assert relevant subsets with `assertSupportsProps(...)`.
- Keep component values, aliases, and prop subsets in the component spec.
- Keep rendering and assertion mechanics in the helper.
- Cover representative common props: `className`, `id`, `lang`, `style`, `title`, `dir`, `tabIndex`, `data-*`, event handlers, and `ref`.
- Sample event handlers across interaction families instead of exhaustively testing every React DOM event.

## CI Split

- `test-unit` runs Moon `:test-unit` tasks.
- `test-functional` runs Moon `:test` tasks and executes Cypress component tests.
- `test-integration` runs Moon `:test-integration` tasks.
- `cli-smoke` validates the packaged CLI after CLI artefacts build.

## CI Gating

- `ci-context` computes affected flags before the test workflows start.
- `test-unit`, `test-functional`, and `test-integration` only run when their task family is affected.
- `cli-smoke` only runs when CLI changes are affected.
