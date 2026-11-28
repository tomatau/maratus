---
'@maratus-registry/field': patch
---

Lets a control's or consumer's class rule win over `.fieldControl`'s default styles, whatever the stylesheet order. The base, invalid, loading, and readonly control rules now sit inside `:where()`, so they carry no specificity.
