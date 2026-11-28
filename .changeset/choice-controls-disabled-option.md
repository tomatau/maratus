---
'@maratus-registry/choice-control': minor
'@maratus-registry/choices-control': minor
---

Item options take `disabled` instead of `isDisabled`, the platform name, as boolean-control's `disabled` option does. Rename `isDisabled` to `disabled` in `getChoiceInputProps`, `getChoiceItemProps`, `getChoicesInputProps`, and `getChoicesItemProps`. A native radio or checkbox still gets the `disabled` attribute, and a custom item still gets `aria-disabled="true"`.
