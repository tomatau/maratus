---
'@maratus-lib/props': minor
---

Adds `preventActivationBehavior(props, isPrevented)`, which cancels a click's activation behaviour, such as toggling a checkbox or submitting a form, after the consumer's `onClick` runs. It also replaces `onChange` with a no-op, since React fires `onChange` from a cancelled click on a checkbox or radio.
