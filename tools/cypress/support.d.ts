declare namespace Cypress {
  type CommonRootEventHandler = {
    alias: string
    prop:
      | 'onBlur'
      | 'onClick'
      | 'onClickCapture'
      | 'onFocus'
      | 'onKeyDown'
      | 'onMouseEnter'
      | 'onPointerDown'
      | 'onTouchStart'
  }

  type CommonRootProps = Partial<{
    className: string
    data: {
      name: string
      value: string
    }
    dir: 'auto' | 'ltr' | 'rtl'
    eventHandlers: readonly CommonRootEventHandler[]
    id: string
    lang: string
    ref: {
      alias: string
    }
    style: {
      name: string
      value: string
    }
    tabIndex: number
    title: string
  }>

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
    assertSupportsProps(commonRootProps: CommonRootProps): Chainable<Subject>
  }
}

declare function createCommonRootProps(
  commonRootProps: Cypress.CommonRootProps,
): any
