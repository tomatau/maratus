---
'@maratus-registry/boolean-control': minor
---

Adds default styles. Both roots take a `booleanControl` class with `--ara-boolean-control-*` tokens for the box and its hover, focus-visible, checked, disabled, invalid, readonly, and loading states, each setting the background, border, foreground, and shadow. `--ara-boolean-control-appearance` defaults to `auto`, so the browser draws a native checkbox until a consumer sets `none`, and the native checkbox's `accent-color` follows `--ara-boolean-control-bg--checked`. The states read ten new theme tokens: `--ara-color-control-bg--checked`, `--ara-color-control-detail--checked`, `--ara-color-control-fg--checked`, `--ara-shadow-control--checked`, `--ara-color-control-bg--invalid`, `--ara-shadow-control--invalid`, `--ara-color-control-bg--readonly`, `--ara-color-control-detail--readonly`, `--ara-color-control-fg--readonly`, and `--ara-shadow-control--readonly`.
