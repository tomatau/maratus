---
'@maratus-registry/choice-control': minor
---

A readonly field now blocks the change itself. Native radios cancel the click and skip `onChange`, while arrow keys still move focus, and custom radio items and listbox options skip the consumer's activation handlers, on the items and the root. Consumers no longer need to prevent the change in `onChange`. A readonly select still passes `onChange` through, since its change cannot be cancelled.
