# Maratus

## Commands

- List available tasks:
  - `just`
  - `just --list`
- Run all tests:
  - `just test`
- Run scoped tests:
  - `just test components button`
  - `just test codemods rewrite-relative-imports`
- Run all unit tests:
  - `just test-unit`
- Run scoped unit tests:
  - `just test-unit codemods rewrite-internal-imports`
- Build all supported outputs:
  - `just build`
- Build artifacts only:
  - `just build artifacts`
- Build all codemods:
  - `just build codemod`
- Build one codemod:
  - `just build codemod rewrite-relative-imports`
- Test Go CLI:
  - `just cli-test`
- Build CLI binary:
  - `just cli-build`
- Run CLI against a consumer config:
  - `just cli vite-css-modules add button`
- Run CLI against the tmp config:
  - `just cli-tmp add button`
