# Arachne - Agents Instructions

## Scope

- Build accessible React components under `components/` (one package per component).
- Use Bun as the primary dev tool.
- Use Playwright component testing for all component validation.

## Docs

- Architecture decisions: [`docs/ARCHITECTURE.md`](/Users/tomatao/Code/tomatao/arachne/docs/ARCHITECTURE.md)
- Runtime/store decisions: [`docs/RUNTIME.md`](/Users/tomatao/Code/tomatao/arachne/docs/RUNTIME.md)
- Component conventions: [`docs/COMPONENTS.md`](/Users/tomatao/Code/tomatao/arachne/docs/COMPONENTS.md)

## Accessibility Baseline

- WCAG 2.2 AA
- WAI-ARIA specification
- Native HTML semantics as primary default
- WAI-ARIA APG patterns for custom widgets when applicable

## How We Extract Requirements

For each component:

1. Identify normative sources (HTML, ARIA, WCAG, APG if relevant).
2. Create `requirements.md` in the component package with IDs (e.g. `REQ-001`) and source links.
3. Mark each requirement as `MUST` or `SHOULD`.
4. Map each requirement to a Playwright component test.

## Requirement Writing

- Requirements translate normative specs into testable component rules.
- Each requirement must be:
  - normative
  - testable
  - independent
  - source-backed
- Prefer observable DOM, ARIA, and keyboard outcomes over abstract wording.
- Use exact spec obligations where possible instead of paraphrased policy.
- Prefer specific spec-defined attributes, states, and behaviors over umbrella requirement statements.
- Record allowed alternatives explicitly when the spec defines them.
- Record relevant spec-defined prohibitions and not-recommended cases when they affect the component contract.
- Organize the matrix with explicit columns for:
  - `ID`
  - `Level`
  - `Requirement`
  - `Source`
  - `Applicability`
- Use `Applicability` to distinguish:
  - `Current`
  - `Potential`
  - `N/A`
- When a requirement applies only in a specific mode, variant, or state, include that condition explicitly in the requirement.

## Enforcement Strategy

A component is done only when:

- Playwright component tests pass.
- Keyboard behaviour tests pass (if interactive).
- Semantics/ARIA assertions pass.
- Axe checks via `@axe-core/playwright` report no violations.
