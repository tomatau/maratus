---
'@maratus-registry/choices-control': minor
---

Adds `disabledBehavior: 'native' | 'focusable'`, defaulting to `native`, as boolean-control has, so a disabled or loading checkbox can stay focusable for a tooltip that explains why. With `focusable`, a native checkbox takes `aria-disabled` in place of `disabled`, drops `name` and `required` so it stays out of form submission and validation, and ignores pointer and keyboard toggles without calling the consumer's handlers. The `ChoicesControlDisabledBehavior` type is exported, checkbox options no longer accept `aria-disabled`, and `CheckboxInputRenderProps` now has an optional `name`.
