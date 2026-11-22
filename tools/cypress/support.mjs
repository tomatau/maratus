import { mount } from 'cypress/react'
import 'cypress-axe'
import 'cypress-real-events'

const CYPRESS_ROOT = '[data-cy-root]'

Cypress.Commands.add('mount', mount)

Cypress.Commands.add('injectAxeAtRoot', () => {
  cy.injectAxe({ axeCorePath: Cypress.expose('axeCorePath') })
})

Cypress.Commands.add('auditA11y', (subject = CYPRESS_ROOT) => {
  cy.checkA11y(subject)
})

Cypress.Commands.add('getByTestId', (testId, options) =>
  cy.get(`[data-testid="${testId}"]`, options),
)

// Asserts that an IDREF list attribute names the given test ids, in order.
Cypress.Commands.add(
  'assertReferences',
  { prevSubject: 'element' },
  (subject, attribute, testIds) =>
    cy.wrap(subject, { log: false }).should(($subject) => {
      const document = $subject.get(0).ownerDocument
      const ids = testIds.map(
        (testId) => document.querySelector(`[data-testid="${testId}"]`)?.id,
      )

      expect(ids, 'referenced ids').to.not.include(undefined)
      expect($subject.attr(attribute), attribute).to.equal(ids.join(' '))
    }),
)

Cypress.Commands.add(
  'checkFormValidity',
  { prevSubject: 'element' },
  (subject) => {
    subject.get(0).checkValidity()

    return cy.wrap(subject, { log: false })
  },
)

// Sets a style hook (a CSS custom property) to a test value on the subject and
// asserts its computed property takes that value. This checks that a state
// uses its hook, not which design token the hook defaults to.
Cypress.Commands.add(
  'assertStyleHook',
  { prevSubject: 'element' },
  (subject, { property, pseudo, value, variable }) => {
    const element = subject.get(0)
    element.style.setProperty(variable, value)

    return cy.wrap(subject, { log: false }).should(() => {
      const computed = element.ownerDocument.defaultView
        .getComputedStyle(element, pseudo)
        .getPropertyValue(property)

      expect(computed, `${property} from ${variable}`).to.equal(value)
    })
  },
)

Cypress.Commands.add('getRootElement', () =>
  cy.get(CYPRESS_ROOT, { log: false }).then(($root) =>
    cy
      .wrap($root, { log: false })
      .children({ log: false })
      .then(($el) => {
        Cypress.log({
          name: 'getRootElement',
          $el,
          message: 'Element rendered at root',
        })

        return $el
      }),
  ),
)

const commonPropAssertions = {
  className: ($subject, commonRootProps) => {
    if (!commonRootProps.className) return

    cy.wrap($subject)
      .should('have.attr', 'class')
      .and('contain', commonRootProps.className)
  },
  data: ($subject, commonRootProps) => {
    if (!commonRootProps.data) return

    cy.wrap($subject).should(
      'have.attr',
      commonRootProps.data.name,
      commonRootProps.data.value,
    )
  },
  dir: ($subject, commonRootProps) => {
    if (!commonRootProps.dir) return

    cy.wrap($subject).should('have.attr', 'dir', commonRootProps.dir)
  },
  eventHandlers: ($subject, commonRootProps) => {
    if (!commonRootProps.eventHandlers) return

    const eventHandlerAssertions = [
      {
        props: ['onFocus'],
        trigger: () => cy.wrap($subject).focus({ force: true }),
      },
      {
        props: ['onBlur'],
        trigger: () => cy.wrap($subject).blur({ force: true }),
      },
      {
        props: ['onClick', 'onClickCapture'],
        trigger: () => cy.wrap($subject).click({ force: true }),
      },
      {
        props: ['onKeyDown'],
        trigger: () =>
          cy.wrap($subject).trigger('keydown', { force: true, key: 'Enter' }),
      },
      {
        props: ['onPointerDown'],
        trigger: () =>
          cy.wrap($subject).trigger('pointerdown', { force: true }),
      },
      {
        props: ['onMouseEnter'],
        // React derives onMouseEnter from mouseover, not mouseenter.
        trigger: () => cy.wrap($subject).trigger('mouseover', { force: true }),
      },
      {
        props: ['onTouchStart'],
        trigger: () => cy.wrap($subject).trigger('touchstart', { force: true }),
      },
    ]

    for (const assertion of eventHandlerAssertions) {
      const matchingEventHandlers = commonRootProps.eventHandlers.filter(
        (eventHandler) => assertion.props.includes(eventHandler.prop),
      )

      if (matchingEventHandlers.length === 0) {
        continue
      }

      assertion.trigger()

      for (const eventHandler of matchingEventHandlers) {
        cy.get(`@${eventHandler.alias}`).should('have.been.called')
      }
    }
  },
  id: ($subject, commonRootProps) => {
    if (!commonRootProps.id) return

    cy.wrap($subject).should('have.attr', 'id', commonRootProps.id)
  },
  lang: ($subject, commonRootProps) => {
    if (!commonRootProps.lang) return

    cy.wrap($subject).should('have.attr', 'lang', commonRootProps.lang)
  },
  ref: (_$subject, commonRootProps) => {
    if (!commonRootProps.ref) return

    cy.get(`@${commonRootProps.ref.alias}`).should('have.been.called')
  },
  style: ($subject, commonRootProps) => {
    if (!commonRootProps.style) return

    cy.wrap($subject)
      .invoke('attr', 'style')
      .should(
        'contain',
        `${commonRootProps.style.name}: ${commonRootProps.style.value}`,
      )
  },
  tabIndex: ($subject, commonRootProps) => {
    if (commonRootProps.tabIndex === undefined) return

    cy.wrap($subject).should(
      'have.attr',
      'tabindex',
      String(commonRootProps.tabIndex),
    )
  },
  title: ($subject, commonRootProps) => {
    if (!commonRootProps.title) return

    cy.wrap($subject).should('have.attr', 'title', commonRootProps.title)
  },
}

// One shared fixture for GPRD-005 common root prop tests.
globalThis.COMMON_ROOT_PROPS = {
  className: 'common-root-class',
  data: { name: 'data-common-root-prop', value: 'supported' },
  dir: 'rtl',
  eventHandlers: [
    { alias: 'commonRootFocus', prop: 'onFocus' },
    { alias: 'commonRootBlur', prop: 'onBlur' },
    { alias: 'commonRootClick', prop: 'onClick' },
    { alias: 'commonRootClickCapture', prop: 'onClickCapture' },
    { alias: 'commonRootKeyDown', prop: 'onKeyDown' },
    { alias: 'commonRootPointerDown', prop: 'onPointerDown' },
    { alias: 'commonRootMouseEnter', prop: 'onMouseEnter' },
    { alias: 'commonRootTouchStart', prop: 'onTouchStart' },
  ],
  id: 'common-root-id',
  lang: 'en-GB',
  ref: { alias: 'commonRootRef' },
  style: { name: '--common-root-prop', value: 'supported' },
  tabIndex: 0,
  title: 'Common root title',
}

// Elements whose id the component owns take the same props without an id.
globalThis.RELATIONSHIP_ROOT_PROPS = {
  ...globalThis.COMMON_ROOT_PROPS,
  id: undefined,
}

globalThis.createCommonRootProps = (commonRootProps) => {
  const eventHandlers = Object.fromEntries(
    (commonRootProps.eventHandlers ?? []).map((eventHandler) => [
      eventHandler.prop,
      cy.stub().as(eventHandler.alias),
    ]),
  )

  return {
    ...(commonRootProps.className
      ? { className: commonRootProps.className }
      : {}),
    ...(commonRootProps.data
      ? { [commonRootProps.data.name]: commonRootProps.data.value }
      : {}),
    ...(commonRootProps.dir ? { dir: commonRootProps.dir } : {}),
    ...eventHandlers,
    ...(commonRootProps.id ? { id: commonRootProps.id } : {}),
    ...(commonRootProps.lang ? { lang: commonRootProps.lang } : {}),
    ...(commonRootProps.ref
      ? { ref: cy.stub().as(commonRootProps.ref.alias) }
      : {}),
    ...(commonRootProps.style
      ? {
          style: {
            [commonRootProps.style.name]: commonRootProps.style.value,
          },
        }
      : {}),
    ...(commonRootProps.tabIndex === undefined
      ? {}
      : { tabIndex: commonRootProps.tabIndex }),
    ...(commonRootProps.title ? { title: commonRootProps.title } : {}),
  }
}

Cypress.Commands.add(
  'assertSupportsProps',
  { prevSubject: 'element' },
  (subject, commonRootProps) => {
    for (const assertion of Object.values(commonPropAssertions)) {
      assertion(subject, commonRootProps)
    }

    return cy.wrap(subject, { log: false })
  },
)
