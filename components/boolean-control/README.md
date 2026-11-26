# BooleanControl

`BooleanControl` answers "Is this on or off?" for a field. The control's
checked state is the field's answer, shown as a checkbox or a switch.

- A radio's checked state answers "Is this the selected value?", so radios
  belong to [`choice-control`](../choice-control).
- A grouped checkbox's checked state answers "Is this value in the
  selection?", so checkbox groups belong to
  [`choices-control`](../choices-control).

The package's rules are in [`requirements.md`](requirements.md), and the
decisions that shaped it are in [`docs/decision-log.md`](docs/decision-log.md).
