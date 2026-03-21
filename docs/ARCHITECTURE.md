# Architecture

## Styling

- Source of truth: CSS Modules in component `src/`.
- CLI aggregates installed component tokens into:
  - `arachne-components.json`
  - `arachne-theme.css`
- Arachne structurally owns the `arachne-theme.css` file.
- Consumers may edit token values, but should keep the single generated wrapper block intact.

### Build

- Build outputs:
  - `css-files`
  - `css-modules`
  - `tailwind-css`
- Builds from the component entry file plus its local relative TS/TSX dependency graph within `src/`.
- Transform any CSS Module import in that local graph into compiled class names and remove the import from the generated source artifact.
- Extract theme tokens into `registry/<component>/meta.json`.

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
