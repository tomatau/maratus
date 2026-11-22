# Development

How to work on Maratus locally. Testing rules live in [`TESTING.md`](./TESTING.md), and release rules in [`RELEASES.md`](./RELEASES.md).

## Setup

1. Install the tools listed in `.prototools` with `proto`.
2. Install the monorepo dependencies with `bun i`.
3. List the available commands with `just --list`.

## Run Tasks With `just`

- Run local tasks through `just` recipes. Moon runs the same package tasks in CI.
- Avoid running moon locally. Its task cache can replay stale output, for example a registry build that restores old lib version pins.
- Most recipes take an optional workspace and package: `just test components field` runs one package, `just test components` runs a workspace, and `just test` runs everything.

## Checks

| Recipe              | Runs                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| `just test`         | Cypress functional tests.                                                |
| `just test-unit`    | `bun test` unit and server-rendering tests.                              |
| `just typecheck`    | `tsgo` over each package's tsconfigs, including `src/*.test-d.ts` files. |
| `just lint`         | `oxlint`.                                                                |
| `just format-check` | `oxfmt --check`. `just format` writes the fixes.                         |
| `just traceability` | The requirements traceability check in `.checks/traceability.py`.        |

Run them for every package a change touches before opening a pull request.

## Create a Package

- Generate a package with `just generate component` or `just generate lib`. The templates live in `templates/`.
- Give each package a `requirements.md` and a `docs/test-design.md`. See [`TESTING.md`](./TESTING.md) for how tests cite requirements.
- New packages start at version `0.0.0`. Their first `minor` changeset releases `0.1.0`, and Changesets writes the `CHANGELOG.md`.
- A lib with nothing to render can drop the template's Cypress config and keep `bun test` only.

## Registry

- Rebuild the registry after changing a component's source, styles, or dependencies, or a lib's version: `just build tools build-registry`. `just build` also builds the codemods and packages.
- Commit the regenerated `registry/` files. CI fails when a fresh build changes them.
- Registry packages pin exact lib versions. After changing a lib version, rebuild the registry before running `bun install`, which cannot resolve a pin that no workspace matches.

## Try Components in a Consumer

Inside the repo, the CLI installs from the local `registry/` and `lib/` directories rather than from npm. Build it first with `just cli-build`, which writes `tmp/bin/maratus`.

### Consumer Apps

`consumers/` holds one example app per style mode:

| Consumer           | Framework | Style          |
| ------------------ | --------- | -------------- |
| `vite-css-modules` | Vite      | `css-modules`  |
| `vite-raw-css`     | Vite      | `css-files`    |
| `next-tailwind`    | Next.js   | `tailwind-css` |

1. Add components with `just cli <consumer> add <component>`, for example `just cli vite-css-modules add choice-control`.
2. Run the app from its directory with `bun run dev`, or check that it builds with `bun run build`.

Each consumer git-ignores its installed components, theme styles, and `maratus-components.json`.

### Scratch Install

For a throwaway install, use the git-ignored `tmp/` directory:

1. Create `tmp/maratus.json` once with `just cli-tmp init`.
2. Add components with `just cli-tmp add <component>`.
3. Clear the installed source with `just clean-tmp-src` before trying again.

## Changesets

- Create a changeset with `just changeset add`.
- Check what would release with `just changeset status`.
- See [`RELEASES.md`](./RELEASES.md#changesets) for which packages to release and how to bump them.
