---
name: propose-component-requirements
description: >-
  Work out a Maratus component with the user, from what it is for to a
  confirmed requirements.md: shape its boundary, agree its normative sources
  and scope, then propose requirement rows one area at a time. Use when
  starting a component package, splitting or merging components, or adding
  to, reviewing or fixing an existing package's requirements.
---

# Propose component requirements

Propose; the user decides. Ask one question at a time, show the spec text
behind each proposal, and treat nothing as agreed until the user confirms it.

This skill holds Maratus's process only. It builds on:

- `a11y-specs`, for finding, weighing and citing the specs;
- `requirements-traceability`, for the file format: unconfirmed rows go in a
  `Prospective` section without IDs, and get an ID once confirmed.

Read `AGENTS.md`, `docs/COMPONENTS.md` and `docs/ARCHITECTURE.md` first. They
hold the requirement-writing rules applied here.

## 1. Shape the component

- Start from what a consumer is trying to build, not from a spec. Ask, if the
  user has not said.
- Lay out the spec units that touch it: HTML elements and attributes, ARIA
  roles, APG patterns and WCAG criteria. Mark which are native.
- Propose a boundary, and say plainly where it does not match a spec unit. A
  Maratus component can be plumbing no single spec defines, as `field` is for
  a control's label, description and error.
- Check `components/` first. Build on an existing package rather than repeat
  it, and say when a proposal would split or merge one.
- Settle the roots (native, and non-native through `as` and `isNative`), the
  compound parts, and the states it supports.

A package's `requirements.md` has these sections, in this order:
`Normative Sources`, `Scope`, `Accessibility Requirements` and
`Product Requirements`. Once the shape is agreed, write the first two:

- `Normative Sources`: each spec section relied on, linked to its exact anchor;
- `Scope`: `Current scope` for what this package does, and `Potential scope`
  for what is plausible later.

## 2. Propose requirements

Work through one area at a time: semantics and naming, each interaction path,
each state including disabled, and each root or variant. For each area:

- Propose rows in `Prospective` with `Level`, `Requirement`, `Source` and
  `Applicability`, naming the mode, variant or state when a row holds only
  there.
- Point at the spec text behind each row, keeping the spec's own strength.
- Include allowed alternatives, and the prohibitions and not-recommended cases
  that affect the component's contract.
- Put library decisions in `Product Requirements` with the source
  `Library policy`. An APG pattern Maratus adopts is one of these, not a
  normative row.
- Cite shared rows from the root `requirements.md`, such as `GPRD-006`, rather
  than restating them.
- Stop for the user to confirm, change or drop the rows. Move confirmed rows
  into `Accessibility Requirements` or `Product Requirements` with the next
  free ID.

## Starting from an existing file

The same two phases apply, as review rather than first drafts.

- Shape: challenge the current `Normative Sources` and `Scope` instead of
  writing them. Propose any section that is missing, and headings that differ
  from the four above.
- Requirements: check each confirmed row against its source. Is its level the
  spec's own? Does the cited text say this? Does it cover each interaction
  path and the disabled state? Is it one independent rule, or several? Then
  look for areas with no rows.
- Propose each change in `Prospective` beside the row it would change, and
  apply it only once confirmed.
- A changed row keeps its ID, so IDs stay sequential. List the tests that cite
  it, found by searching for the ID, so the user can re-read them.

## Done

Every area in scope has confirmed rows or an explicit `N/A`, and every
confirmed row names an observable DOM, ARIA or keyboard outcome a Cypress test
can cite by its ID.
