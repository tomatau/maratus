# Productionisation

## Purpose

This document records productionisation decisions for Maratus's distribution, update, and installation model.

Treat incrementally validated decisions as settled.
Keep open questions explicit until we agree them.

## Validated Decisions

### Registry and Discovery

- npm is the canonical registry for Maratus.
- The CLI must be able to discover newly published components and codemods without requiring the consumer to manually update the CLI first.
- The CLI should remain lightweight and should not embed the full catalogue of components, lib packages, or codemods.
- Discovery should not rely on npm package naming conventions alone.
- Publish catalogue metadata in a separate npm index package rather than bundling it into the CLI package.
- The CLI package remains the primary suggested installation model, while ephemeral invocation remains a supported user option through launchers such as `bunx`, `npx`, `pnpm dlx`, and `yarn dlx`.

### Installation Model

- Components and codemods are transient installation artefacts.
- Commands such as `add` may install versioned component and codemod packages into the consumer project temporarily to copy source and run migrations.
- Record installed component versions in `maratus-components.json`.
- Remove transient component and codemod packages automatically after a successful install flow.

## Working Model

The intended model is:

1. The consumer installs the Maratus CLI package.
2. The consumer runs a command such as `init` or `add`.
3. The same command surface should also remain compatible with ephemeral invocation.
4. The CLI consults npm to discover available components and codemods.
5. The CLI uses the consumer's package manager to install the required transient packages.
6. The CLI copies component source into the consumer project, runs required codemods, and updates Maratus-managed metadata.
7. The CLI removes the transient packages once the operation completes.

## Registry Index Package

Publish an npm package that contains catalogue metadata for components, lib packages, and codemods.

This package decouples discovery from CLI releases:

- We can publish new catalogue entries without requiring a CLI release
- The release pipeline can update the index package as part of normal npm publishing

The index package is the source of truth for catalogue discovery.
Treat CLI self-update behaviour as a separate concern rather than conflating it with registry refresh.

## Codemod Compatibility Metadata

Start the compatibility schema small and only grow it when a real use case requires it.
It is not intended to be fully general up front, and it may change as Maratus evolves.

The minimal shape to start with is:

- `name`: codemod identifier
- `package`: npm package name to install transiently
- `version`: published codemod version
- `component`: component affected by the codemod when applicable
- `from`: installed component version or semver range the codemod applies to
- `to`: target component version the codemod migrates towards

Introduce more fields later when the CLI actually needs them:

- `kind`: e.g. `upgrade-component`, `migrate-project`, `init-project`
- `requirements`: optional constraints such as minimum CLI version, supported package managers, or runtime constraints
- `mutations`: optional declaration of what the codemod may update, such as component source, config files, or theme files

This is enough for the CLI to answer the immediate question:

> Given an installed component version, which codemod package should move it to the next supported version?

### Full Shape

Keep the index package intentionally small and include only the metadata the CLI requires.

The full proposed shape is:

- `version`: schema version for the index format
- `publishedAt`: publish timestamp for the index package contents
- `packages`: package-level metadata used by the CLI
- `components`: available installable components
- `libraries`: available installable lib packages
- `codemods`: available codemods and migrations

The `packages` section may include:

- `cli`: canonical CLI package name and latest version metadata
- `runner`: codemod runner package name and latest version metadata

The `components` section may include, per component:

- `name`
- `package`
- `version`
- `dependencies`: transient package dependencies required for install
- `libraryDependencies`: Maratus lib packages that should also be installed
- `requirements`: optional runtime or package manager constraints

The `libraries` section may include, per lib package:

- `name`
- `package`
- `version`
- `requirements`

The `codemods` section may include, per codemod:

- the codemod compatibility metadata described above

Start with only the fields the first production workflows need, and add fields only when real CLI behaviour exercises them.

## Open Questions

- How should the CLI cache npm registry and index-package discovery data, and what should the refresh TTL be?
- Should the CLI perform a periodic self-update check separately from registry refresh, and if so, how should it surface that information?
