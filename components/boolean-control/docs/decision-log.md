# BooleanControl decision log

Product decisions, including API shape, newest first: the choice made, why,
and the alternatives ruled out. Implementation details, bug fixes, and
anything a requirement or doc already states stay out; link to them instead.

## Root and semantics are separate options (2026-11-26)

- **Decision:** `mode` picks the root and `role` the semantics (PRD-002).
- **Why:** `role` alone used to pick the root, so a native checkbox with
  `role="switch"` lost `name`, `required`, and `type`.
- **Ruled out:** one `mode` per root and role, such as `custom-switch`, which
  adds an abstraction for consumers to learn.
