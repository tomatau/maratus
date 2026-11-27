---
'@maratus-registry/boolean-control': minor
---

Separates the native and custom roots. A custom root now takes `mode: 'custom'` and requires `role` and `checked`, while `role` alone keeps the native checkbox and sets `role="switch"` on it. The hook writes each root's state itself: `checked` or `aria-checked`, a new `disabled` option as `disabled` or `aria-disabled`, `aria-readonly`, and `data-loading`. A consumer's `readOnly` is stripped with a development warning. `NativeBooleanControlRenderProps`, `CustomBooleanControlRenderProps`, `UseNativeBooleanControlResult`, and `UseCustomBooleanControlResult` replace `BooleanControlRenderArgs` and `BooleanControlRenderProps`.
