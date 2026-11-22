---
name: prepare-component-release
description: >-
  Prepare a code-complete Maratus branch for its pull request so its
  component and lib changes release cleanly: rebuild and commit the
  registry, write changesets that meet CI's release rules, and propose the
  commit stack. Use when a branch that adds or changes a component, lib, or
  codemod package is code complete and about to become a pull request.
---

# Prepare a component release

This skill covers the step between a branch being code complete and its pull
request being opened. Tests, type checks and requirement coverage are covered
elsewhere; run them first.

Read `docs/DEVELOPMENT.md` and `docs/RELEASES.md` first. They hold the
commands and rules applied here. Run local tasks through `just`, not moon.

Propose; the user decides. Never commit or push without approval, and never
stage or unstage files the user manages.

## 1. Rebuild the registry

- Rebuild with `just build tools build-registry` after changing a component's
  source, styles or dependencies, or a lib's version.
- The rebuild rewrites `registry/*/package.json`, `meta.json` and the style
  directories. Review the diff: it should match the source change.
- Registry packages pin exact lib versions. After changing a lib version,
  rebuild before `bun install`, which cannot resolve a pin that no workspace
  matches.

## 2. Write the changesets

- Follow `docs/RELEASES.md#changesets` for which packages to release and how
  to bump them. Changesets ignores `@maratus-component/*`; release the
  matching `@maratus-registry/*` and `@maratus-lib/*` packages.
- A new package starts at `0.0.0`, so its first `minor` changeset releases
  `0.1.0`. Check that a package created from a template still says `0.0.0`.
- Any change to registry metadata needs a changeset that releases
  `@maratus/manifest`. CI's changeset check fails without one.
- Write one changeset per logical change, naming what a consumer sees, such as
  a new component or a changed hook option.
- Check the result with `just changeset status`. Once committed, confirm with
  `bun run changeset status --since=main` that the release plan includes
  `@maratus/manifest` whenever registry metadata changed.

## 3. Propose the commit stack

- Propose the commits, oldest first, before making any of them. Each commit
  should build and pass its own checks.
- Commit the changesets on their own, as `changeset: …`, after the commits
  they describe.
- Leave out files the user has not asked to commit.
