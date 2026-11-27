# BooleanControl decision log

Product decisions, including API shape, newest first: the choice made, why,
and the alternatives ruled out. Implementation details, bug fixes, and
anything a requirement or doc already states stay out; link to them instead.

## The hook owns the checked state (2026-11-26)

- **Decision:** consumers pass `checked` to the hook, which writes `checked`
  or `aria-checked` (PRD-005).
- **Why:** owning the attribute is the only way to keep `aria-checked` off a
  native checkbox (REQ-014), and switching `mode` leaves how a consumer
  passes state unchanged.
- **Ruled out:** consumers writing `checked` or `aria-checked` themselves.

## Root and semantics are separate options (2026-11-26)

- **Decision:** `mode` picks the root and `role` the semantics (PRD-002).
- **Why:** `role` alone used to pick the root, so a native checkbox with
  `role="switch"` lost `name`, `required`, and `type`.
- **Ruled out:** one `mode` per root and role, such as `custom-switch`, which
  adds an abstraction for consumers to learn.
