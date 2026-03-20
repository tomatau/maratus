# Architecture

## Styling

- Source of truth: CSS Modules in component `src/`.
- Build outputs:
  - `css-files`
  - `css-modules`
  - `tailwind-css`
- Theme tokens are extracted at build time into `registry/<component>/meta.json`.
- CLI aggregates installed component tokens into:
  - `arachne-components.json`
  - `arachne-theme.css`
- `arachne-theme.css` is owned by Arachne structurally.
- Consumers may edit token values, but should keep the single generated wrapper block intact.

## Composition

- `as` prop for ownership clarity without slot-merging rules.
- `as` supports:
  - intrinsic element substitution
  - callback composition for advanced cases
- Do not introduce a slot primitive until a component actually needs composition via props.

## State

- External stores with selective subscriptions.
- Global provider containing domain-specific stores.
- Hooks may register local instances into shared stores when cross-tree coordination is required.

## Build Order

1. `Button`
2. focus modality
3. `Link`
4. next composite state domain
