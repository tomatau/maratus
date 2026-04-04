# Packages

## Purpose

This document defines Maratus's package naming and visibility rules.

## Rules

- Publish core public Maratus packages under `@maratus/*`.
- Publish specialised public package families under a dedicated scope such as `@maratus-registry/*` or `@maratus-codemod/*` when the scope should communicate package role.
- Keep private multi-package workspaces under a dedicated scope such as `@maratus-component/*` or `@maratus-consumer/*`.

## Workspace Mapping

- `packages/*` publishes directly consumable public packages under `@maratus/*`.
- `lib/*` publishes directly consumable public packages under `@maratus/*` (but also indirect consumption through CLI).
- `registry/*` publishes non-direct-consumption public packages under `@maratus-registry/*`.
- `codemods/*` publishes non-direct-consumption public packages under `@maratus-codemod/*`.
- `components/*` stays private under `@maratus-component/*`.
- `consumers/*` stays private under `@maratus-consumer/*`.

## Notes

- Public does not imply first-class direct consumption. Scope communicates role and intent.
- Keep `tools/*` private unless a tool becomes part of the public release surface.
