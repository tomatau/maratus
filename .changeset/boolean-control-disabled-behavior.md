---
'@maratus-registry/boolean-control': minor
---

Adds `disabledBehavior: 'native' | 'focusable'`, defaulting to `native`, so a disabled or loading control can stay focusable for a tooltip that explains why. With `focusable`, a native checkbox takes `aria-disabled` in place of `disabled`, stays out of form submission and validation, and ignores pointer and keyboard toggles, and a custom root keeps `tabIndex` `0`. The `BooleanControlDisabledBehavior` type is exported, and `NativeBooleanControlRenderProps` now has an optional `name` and `aria-disabled`.
