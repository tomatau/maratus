# Components

## Props

- Keep platform prop names when the platform already defines the concept.
- Use `isX` for library-defined boolean state.

```ts
type ExampleProps = {
  disabled?: boolean
  isLoading?: boolean
  isPressed?: boolean
}
```

## Content

- Prefer `children` over wrapper-specific content props such as `label`.
- Add explicit slots only when structure requires them.

## Styling

- Base components expose CSS variable hooks.
- Visual variant taxonomy lives in consumer wrappers, not base components.
- Build outputs are generated from CSS Modules source.
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
- Theme token word order is:
  - namespace
  - token kind
  - semantic category
  - property
  - state modifier

```css
--ara-color-control-bg
--ara-color-control-text
--ara-color-content-border
--ara-color-control-bg--disabled
```

## State

- Base components should expose semantic state before visual variant APIs.
- State hooks should scale to element-level `...Props` return shapes.

```ts
const { triggerProps, isFocusVisible } = useSomething()
```

## Accessibility

- Native semantics first.
- Library props should add accessibility semantics, not replace platform semantics.
- Loading state should set accessibility semantics and disable the control when appropriate.
