# Components

## Component Anatomy

- Components select the root, split component-only props, call the hook, and render named prop bags.
- Hooks own prop composition, semantics, state attributes, default class names, and event composition.
- Hooks that compose element props return named prop bags such as `buttonProps`, `linkProps`, or `fieldRootProps`.
- Shared behaviour belongs in hooks, not components.

## Props

- Keep platform prop names when the platform already defines the concept.
- Use `isX` for library-defined boolean state.
- Pass through consumer props unless the component owns that semantic contract.
- Owned semantics win when overrides would break accessibility, relationships, activation, or state.
- Consumer props may override non-semantic props without breaking the contract.
- Compose event handlers: consumers run first; optional synthetic behaviour respects `event.defaultPrevented`.

```ts
type ExampleProps = {
  disabled?: boolean
  isLoading?: boolean
  isPressed?: boolean
}
```

## Content

- Prefer `children` over wrapper-specific content props such as `label`.
- Add explicit slots when structure requires them.
- Compound roots may put relationship-driving content in context when descendants need it for composition.
- Use a named render prop for repeated generated content when `children` would imply a single render target.

## Styling

- Base components expose CSS variable hooks.
- Visual variant taxonomy lives in consumer wrappers, not base components.
- Generated build outputs from CSS Modules source.
- Component CSS Modules define component-local tokens that map to shared theme tokens.
- Component-local token word order is:
  - namespace
  - component
  - part, when needed
  - property
  - state modifier
- Component-local tokens should use state modifiers with a double hyphen suffix.
- Semantic categories:
  - `control`
  - `nav`
  - `content`
  - `feedback`
  - `surface`
- Token kinds:
  - `color`
  - `spacing`
  - `border`
  - `radius`
  - `shadow`
- Shared color property groups:
  - `bg`
  - `fg`
  - `detail`
  - `focus`
- Theme token word order is:
  - namespace
  - token kind
  - semantic category
  - property
  - state modifier

```css
--ara-color-control-bg
--ara-color-control-fg
--ara-color-content-detail
--ara-color-control-focus
--ara-color-control-bg--disabled
--ara-shadow-control
--ara-shadow-control--hover
# component tokens
--ara-button-bg
--ara-button-bg--disabled
--ara-field-control-detail--invalid
```

### State Selectors

- Prefer native pseudo-classes and native attributes where available.
- Pair native selectors with component state attributes when the state can also come from non-native roots or shared runtime state.
- Use empty-string `data-*` attributes for boolean state hooks.
- Use semantic state names such as `data-loading`, `data-focus-visible`, `data-required`, and `data-readonly`.
- Style ARIA-backed states through their observable attributes where appropriate, such as `[aria-disabled='true']`, `[aria-invalid='true']`, and `[aria-readonly='true']`.

## State

- Base components should expose semantic state before visual variant APIs.
- State hooks should scale to element-level `...Props` return shapes.
- Loading state should expose both semantics and a `data-loading` styling hook when the component has visible loading styling.
- Focus-visible state should pair the browser `:focus-visible` selector with a `data-focus-visible` styling hook when shared focus modality is involved.

```ts
const { triggerProps, isFocusVisible } = useSomething()
```

## Accessibility

- Native semantics first.
- Library props should add accessibility semantics, not replace platform semantics.
- Loading state should set accessibility semantics and disable the control when appropriate.
- Native roots should avoid redundant ARIA roles when the platform already exposes the same semantics.
- Non-native roots must receive the role, focusability, and keyboard behaviour needed to preserve the native interaction contract.
