# Testing

## Local Commands

- `just test` runs package-level functional test tasks.
- `just test-unit` runs package-level unit test tasks.
- `just test-integration` runs package-level integration test tasks.

## CI Split

- `test-unit` runs Moon `:test-unit` tasks.
- `test-functional` runs Moon `:test` tasks and installs Playwright browsers.
- `test-integration` runs Moon `:test-integration` tasks.
- `cli-smoke` validates the packaged CLI after CLI artefacts build.

## CI Gating

- `ci-context` computes affected flags before the test workflows start.
- `test-unit`, `test-functional`, and `test-integration` only run when their task family is affected.
- `cli-smoke` only runs when CLI changes are affected.
