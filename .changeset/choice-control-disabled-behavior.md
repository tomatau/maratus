---
'@maratus-registry/choice-control': minor
---

Adds `disabledBehavior: 'native' | 'focusable'`, defaulting to `native`, as boolean-control has, so a disabled or loading radio can stay focusable for a tooltip that explains why. With `focusable`, a radio takes `aria-disabled` in place of `disabled`, drops `required`, and ignores pointer and keyboard selection without calling the consumer's handlers. It keeps its `name` to stay in its group, so a checked one still submits its value. The select stays natively disabled while loading. The `ChoiceControlDisabledBehavior` type is exported, and radio options no longer accept `aria-disabled`.
