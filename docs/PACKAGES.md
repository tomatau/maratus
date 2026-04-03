# Packages

## Purpose

This document defines Arachne's package naming and visibility rules.

## Rules

- Publish core public Arachne packages under `@arachne/*`.
- Publish specialised public package families under a dedicated scope such as `@arachne-registry/*` or `@arachne-codemod/*` when the scope should communicate package role.
- Keep private multi-package workspaces under a dedicated scope such as `@arachne-component/*` or `@arachne-consumer/*`.

## Workspace Mapping

- `packages/*` publishes directly consumable public packages under `@arachne/*`.
- `lib/*` publishes directly consumable public packages under `@arachne/*` (but also indirect consumption through CLI).
- `registry/*` publishes non-direct-consumption public packages under `@arachne-registry/*`.
- `codemods/*` publishes non-direct-consumption public packages under `@arachne-codemod/*`.
- `components/*` stays private under `@arachne-component/*`.
- `consumers/*` stays private under `@arachne-consumer/*`.

## Notes

- Public does not imply first-class direct consumption. Scope communicates role and intent.
- Keep `tools/*` private unless a tool becomes part of the public release surface.
