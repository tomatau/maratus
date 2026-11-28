# BooleanControl decision log

Product decisions, including API shape, newest first: the choice made, why,
and the alternatives ruled out. Implementation details, bug fixes, and
anything a requirement or doc already states stay out; link to them instead.

## A focusable disabled control is not readonly (2026-11-27)

- **Decision:** `disabledBehavior: 'focusable'` keeps a disabled control
  focusable with `aria-disabled` (PRD-019 to PRD-024).
- **Why:** readonly says the value is fixed, not that the control is
  unavailable, and assistive technologies announce it differently.
- **Ruled out:** readonly as the focusable alternative.

## Readonly blocks the change for the consumer (2026-11-27)

- **Decision:** a readonly field blocks the change on both roots, so the
  consumer has nothing to wire (REQ-042 to REQ-045).
- **Why:** React fires a checkbox's `onChange` before the browser undoes a
  cancelled click, so a consumer handler sees the flipped value.
- **Ruled out:** passing `onChange` through so the consumer prevents the
  change.

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
