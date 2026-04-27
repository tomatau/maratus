declare namespace Cypress {
  interface Chainable<Subject = any> {
    mount: (typeof import('cypress/react'))['mount']
    injectAxeAtRoot(): Chainable<void>
    auditA11y(subject?: string): Chainable<void>
    getByTestId<TElement extends HTMLElement = HTMLElement>(
      testId: string,
      options?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >,
    ): Chainable<JQuery<TElement>>
    getRootElement(): Chainable<JQuery<HTMLElement>>
  }
}
