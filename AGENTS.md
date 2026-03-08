# Arachne - Agents Instructions

## Scope

- Build accessible React components under `components/` (one package per component).
- Use Bun as the primary dev tool.
- Use Playwright component testing for all component validation.

## Accessibility Baseline

- WCAG 2.2 AA
- WAI-ARIA specification
- Native HTML semantics as primary default
- WAI-ARIA APG patterns for custom widgets when applicable

## How We Extract Requirements

For each component:

1. Identify normative sources (HTML, ARIA, WCAG, APG if relevant).
2. Create a requirements matrix with IDs (e.g. `REQ-001`) and source links.
3. Mark each requirement as `MUST` or `SHOULD`.
4. Map each requirement to a Playwright component test.

## Enforcement Strategy

A component is done only when:

- Playwright component tests pass.
- Keyboard behavior tests pass (if interactive).
- Semantics/ARIA assertions pass.
- Axe checks via `@axe-core/playwright` report no violations.
