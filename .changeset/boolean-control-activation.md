---
'@maratus-registry/boolean-control': minor
---

Gives the custom root focus and keyboard activation. It takes `tabIndex` `0`, or `-1` while disabled or loading, unless the consumer passes one, and `Space` calls the consumer's `onClick` after its key handler unless that handler prevents default. `Space` on a focused custom root no longer scrolls the page. A readonly field now blocks changes on both roots: the native checkbox cancels the toggle and skips `onChange`, and the custom root skips the consumer's activation handlers.
