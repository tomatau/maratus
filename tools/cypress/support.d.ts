declare namespace Cypress {
  interface Chainable<Subject = any> {
    mount: (typeof import('cypress/react'))['mount']
    injectAxeAtRoot(): Chainable<void>
    auditA11y(subject?: string): Chainable<void>
  }
}
