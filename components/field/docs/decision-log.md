# Field decision log

Product decisions, including API shape, newest first: the choice made, why,
and the alternatives ruled out. Implementation details, bug fixes, and
anything a requirement or doc already states stay out; link to them instead.

## Controls own their styling (2026-11-28)

- **Decision:** each control's CSS module styles everything on its root,
  including the field-level states, with tokens that map only to theme
  tokens, the same ones field uses for each state. Field's control styles
  are a baseline any control or consumer overrides (PRD-028).
- **Why:** the control styles were written when field's only control was the
  text input, and stayed in field without a decision when text-control split
  out. Shared rules give every control one look per state, and equal-weight
  rules in two packages leave the winner to bundle order. Theme tokens
  already join button and link.
- **Ruled out:** field styling each control's own states; field-level states
  styled only in field; and control tokens that fall back to field tokens,
  which mixes two token layers.

## No helper for merging field control props (2026-11-27)

- **Decision:** field adds no helper for merging `fieldControlProps` and
  `validityHandlerProps` until one returns more than the API surface it adds.
