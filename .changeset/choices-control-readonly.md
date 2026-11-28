---
'@maratus-registry/choices-control': minor
---

A readonly field now blocks the change itself. Native checkboxes cancel the click and skip `onChange`, and custom checkbox items and listbox options skip the consumer's activation handlers, on the items and the root. Consumers no longer need to prevent the change in `onChange`.
