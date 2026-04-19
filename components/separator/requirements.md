# Separator Requirements

## Normative Sources

- HTML Standard: [`hr` element](https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element)
- WAI-ARIA 1.2: [`separator` role](https://www.w3.org/TR/wai-aria-1.2/#separator)
- ARIA in HTML: [`hr` element](https://www.w3.org/TR/html-aria/#el-hr)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)

## Scope

### Current scope

- Native horizontal separator output
- Vertical separator output
- Decorative mode
- Non-focusable separator behavior

### Potential scope

- Focusable separator behavior with range-widget semantics

## Matrix

| ID      | Level  | Requirement                                                                                                                                     | Source                                        | Applicability |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------- |
| REQ-001 | MUST   | When the separator is horizontal, render a native `<hr>` element.                                                                               | HTML Standard `hr` element; WCAG 2.2 SC 4.1.2 | Current       |
| REQ-002 | MUST   | When the separator is non-decorative, do not set `aria-hidden="true"`.                                                                          | HTML Standard `hr` element; WCAG 2.2 SC 4.1.2 | Current       |
| REQ-003 | MUST   | When the separator is decorative, set `aria-hidden="true"`.                                                                                     | WAI-ARIA 1.2 `separator`; WCAG 2.2 SC 4.1.2   | Current       |
| REQ-004 | SHOULD | When the separator is horizontal and uses `<hr>`, do not set an explicit `role="separator"`.                                                    | ARIA in HTML `hr`                             | Current       |
| REQ-005 | MAY    | When the separator uses `<hr>` for purely visual presentation, allow `role="none"` and `role="presentation"`.                                   | ARIA in HTML `hr`                             | Current       |
| REQ-006 | MUST   | When the separator is vertical, expose separator semantics with `aria-orientation="vertical"`.                                                  | WAI-ARIA 1.2 `separator`; WCAG 2.2 SC 4.1.2   | Current       |
| REQ-007 | MUST   | When the separator is focusable, set `aria-valuenow`.                                                                                           | WAI-ARIA 1.2 `separator`; WCAG 2.2 SC 4.1.2   | N/A           |
| REQ-008 | SHOULD | When the separator is focusable, set `aria-valuemin` and `aria-valuemax`; if omitted, default values are 0 and 100.                             | WAI-ARIA 1.2 `separator`                      | N/A           |
| REQ-009 | SHOULD | When the separator is focusable and the current value is not user-friendly, set `aria-valuetext`.                                               | WAI-ARIA 1.2 `separator`                      | N/A           |
| REQ-010 | MUST   | When the separator is horizontal and does not use `<hr>`, expose separator semantics with `role="separator"` and do not set `aria-orientation`. | WAI-ARIA 1.2 `separator`; WCAG 2.2 SC 4.1.2   | Current       |
