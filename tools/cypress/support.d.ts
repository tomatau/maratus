declare namespace Cypress {
  interface Chainable<Subject = any> {
    mount: (typeof import('cypress/react'))['mount']
    injectAxeAtRoot(): Chainable<void>
    auditA11y(subject?: string): Chainable<void>
    getByTestId(
      testId: string,
      options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>,
    ): Chainable<JQuery<HTMLElement>>
    getRootElement(): Chainable<Subject>
  }
}
