# Link Requirements

## Normative Sources

- HTML Standard: [`a` element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)
- WAI-ARIA 1.2: [`link` role](https://www.w3.org/TR/wai-aria-1.2/#link)
- ARIA in HTML: [`a` with `href`](https://www.w3.org/TR/html-aria/#el-a)
- WCAG 2.2 SC 2.4.4: [Link Purpose (In Context)](https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html)
- WCAG 2.2 SC 2.4.7: [Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)
- Selectors Level 4: [`:focus-visible`](https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo)

## Scope

### Current scope

- Native anchor output
- Root substitution through `as`
- Hyperlink semantics driven by `href`
- Accessible naming inputs
- Native hyperlink attribute passthrough
- Focus-visible behaviour

### Potential scope

- Placeholder or disabled link mode without `href`
- Current-page semantics such as `aria-current`
- Router integration that still preserves native anchor semantics
- Download or external-link affordance APIs beyond native HTML attributes

## Accessibility Requirements

| ID      | Level  | Requirement                                                                                                                                                                   | Source                                                            | Applicability |
| :------ | :----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | When the component represents a navigable link, render a native `<a>` element with an `href` attribute.                                                                       | HTML Standard `a` element; WAI-ARIA 1.2 `link`; WCAG 2.2 SC 4.1.2 | Current       |
| REQ-002 | MUST   | When `href` is present, expose hyperlink semantics with a programmatically determinable link role and accessible name.                                                        | HTML Standard `a` element; WAI-ARIA 1.2 `link`; WCAG 2.2 SC 4.1.2 | Current       |
| REQ-003 | MUST   | When `href` is present, activation must enable normal native hyperlink behaviour.                                                                                             | HTML Standard `a` element; WAI-ARIA 1.2 `link`                    | Current       |
| REQ-004 | MUST   | Support accessible naming inputs provided through native anchor text content, `aria-label`, and `aria-labelledby`.                                                            | HTML Standard `a` element; WCAG 2.2 SC 4.1.2                      | Current       |
| REQ-005 | MUST   | Do not render interactive content descendants, descendant `a` elements, or descendants with a specified `tabindex` attribute as part of the base component output.            | HTML Standard `a` element                                         | Current       |
| REQ-006 | SHOULD | When the component renders a native `<a href>`, do not set a redundant explicit `role="link"`.                                                                                | ARIA in HTML `a` with `href`                                      | Current       |
| REQ-007 | SHOULD | When the component supports native hyperlink attributes such as `target`, `rel`, `download`, `hreflang`, `type`, or `referrerPolicy`, preserve them.                          | HTML Standard `a` element                                         | Current       |
| REQ-008 | MUST   | When the component receives keyboard focus, provide a visible focus indicator in at least one mode of operation.                                                              | WCAG 2.2 SC 2.4.7                                                 | Current       |
| REQ-009 | SHOULD | When the component exposes author styling for focus indication, keep it compatible with the user agent’s `:focus-visible` heuristics.                                         | Selectors Level 4 `:focus-visible`; WCAG 2.2 SC 2.4.7             | Current       |
| REQ-010 | MUST   | If the component renders an `a` element without `href`, omit hyperlink-only attributes such as `target`, `download`, `ping`, `rel`, `hreflang`, `type`, and `referrerPolicy`. | HTML Standard `a` element                                         | Potential     |

### Given Non-Native Root

| ID      | Level  | Requirement                                                                                                                              | Source                                        | Applicability |
| :------ | :----- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------- |
| REQ-011 | MUST   | When the component renders a non-native root that represents a navigable link, expose link semantics with `role="link"`.                 | WAI-ARIA 1.2 `link`; WCAG 2.2 SC 4.1.2        | Current       |
| REQ-012 | MUST   | When the component renders a non-native root that represents a navigable link, keep it keyboard focusable.                               | WAI-ARIA 1.2 `link`; WCAG 2.2 SC 2.1.1, 4.1.2 | Current       |
| REQ-013 | MUST   | When the component renders a non-native root that represents a navigable link, support keyboard activation through the Enter key.        | WAI-ARIA 1.2 `link`; WCAG 2.2 SC 2.1.1        | Current       |
| REQ-014 | SHOULD | When the component renders a non-native root that represents a navigable link, do not set a redundant `aria-orientation` or button role. | WAI-ARIA 1.2 `link`                           | Current       |

## Product Requirements

| ID      | Requirement                                                                        | Applicability |
| ------- | ---------------------------------------------------------------------------------- | ------------- |
| PRD-001 | Keep native `<a>` as the default rendered element for `Link`.                      | Current       |
| PRD-002 | Support the global `as` root substitution pattern for `Link`.                      | Current       |
| PRD-003 | Expose a `data-focus-visible` state hook when keyboard focus is visibly indicated. | Current       |
| PRD-004 | Expose a `data-loading` state hook when the link is in a loading state.            | Potential     |
