# Button Requirements

## Normative Sources

- HTML Standard: [`button` element](https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element)
- WAI-ARIA 1.2: [`button` role](https://www.w3.org/TR/wai-aria-1.2/#button)
- WAI-ARIA 1.2: [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.2/#aria-pressed)
- WAI-ARIA 1.2: [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.2/#aria-disabled)
- ARIA in HTML: [`button` element](https://www.w3.org/TR/html-aria/#el-button)
- WCAG 2.2 SC 4.1.2: [Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html)

## Scope

### Current scope

- Native button output
- Disabled state
- Toggle button state
- Loading state semantics

### Potential scope

- Alternate rendered elements
- Focus modality
- Icon slots
- Progress or pending announcement patterns beyond `aria-busy`
- Full HTML form-associated behaviour
- Command and popover button features

## Matrix

| ID      | Level  | Requirement                                                                                                                                                                                  | Source                                                                              | Applicability |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| REQ-001 | MUST   | Render a native `<button>` element for the default button variant.                                                                                                                           | HTML Standard `button` element; WCAG 2.2 SC 4.1.2                                   | Current       |
| REQ-002 | MUST   | Expose button semantics with a programmatically determinable button role and accessible name.                                                                                                | WAI-ARIA 1.2 `button`; WCAG 2.2 SC 4.1.2                                            | Current       |
| REQ-003 | MUST   | When the button uses the HTML `disabled` attribute, prevent user activation.                                                                                                                 | HTML Standard `button` activation behavior                                          | Current       |
| REQ-004 | MUST   | When the button is disabled, expose disabled semantics with HTML `disabled`, `aria-disabled`, or both as appropriate to the rendered variant.                                                | HTML Standard `disabled` attribute; WAI-ARIA 1.2 `aria-disabled`; WCAG 2.2 SC 4.1.2 | Current       |
| REQ-005 | MUST   | When the button is a toggle button, set `aria-pressed` to `true`, `false`, or `mixed` as appropriate.                                                                                        | WAI-ARIA 1.2 `button`; WAI-ARIA 1.2 `aria-pressed`; WCAG 2.2 SC 4.1.2               | Current       |
| REQ-006 | MUST   | When the button is not a toggle button, do not set `aria-pressed`.                                                                                                                           | WAI-ARIA 1.2 `button`; WAI-ARIA 1.2 `aria-pressed`                                  | Current       |
| REQ-007 | SHOULD | When the button uses `aria-disabled`, also change its appearance to indicate the disabled state.                                                                                             | WAI-ARIA 1.2 `aria-disabled`                                                        | Current       |
| REQ-008 | MUST   | When the button exposes a supported state such as pressed, disabled, busy, or expanded, expose that state programmatically.                                                                  | WCAG 2.2 SC 4.1.2                                                                   | Current       |
| REQ-009 | MUST   | Do not include interactive descendants or descendants with a `tabindex` attribute inside the button content model.                                                                           | HTML Standard `button` element                                                      | Current       |
| REQ-010 | SHOULD | When the button is a native `<button>`, do not set a redundant explicit `role="button"`.                                                                                                     | ARIA in HTML `button`                                                               | Current       |
| REQ-011 | MUST   | When the button renders with `type="submit"`, allow normal HTML form submission behavior.                                                                                                    | HTML Standard `button` element                                                      | Potential     |
| REQ-012 | MUST   | When the button renders with `type="reset"`, allow normal HTML form reset behavior.                                                                                                          | HTML Standard `button` element                                                      | Potential     |
| REQ-013 | MUST   | When the button omits `type` or uses an invalid `type`, use the HTML button missing-value and invalid-value default.                                                                         | HTML Standard `button` element                                                      | Potential     |
| REQ-014 | MUST   | When the button uses HTML form submission attributes, only use attributes valid for submit buttons, including `formaction`, `formenctype`, `formmethod`, `formnovalidate`, and `formtarget`. | HTML Standard `button` element                                                      | Potential     |
| REQ-015 | SHOULD | When the button uses HTML form association, support the `form`, `name`, and `value` attributes according to the HTML button element rules.                                                   | HTML Standard `button` element                                                      | Potential     |
| REQ-016 | SHOULD | When the button supports command or popover behavior, support the relevant HTML button attributes such as `command`, `commandfor`, `popovertarget`, and `popovertargetaction`.               | HTML Standard `button` element                                                      | Potential     |
