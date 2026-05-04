import { useStoreRuntime } from '@maratus-lib/store-runtime'
import { Link } from '../src'

const commonRootProps = {
  className: 'common-root-class',
  data: {
    name: 'data-common-root-prop',
    value: 'supported',
  },
  dir: 'rtl' as const,
  eventHandlers: [
    {
      alias: 'commonRootFocus',
      prop: 'onFocus',
    },
    {
      alias: 'commonRootBlur',
      prop: 'onBlur',
    },
    {
      alias: 'commonRootClick',
      prop: 'onClick',
    },
    {
      alias: 'commonRootClickCapture',
      prop: 'onClickCapture',
    },
    {
      alias: 'commonRootKeyDown',
      prop: 'onKeyDown',
    },
    {
      alias: 'commonRootPointerDown',
      prop: 'onPointerDown',
    },
    {
      alias: 'commonRootMouseEnter',
      prop: 'onMouseEnter',
    },
    {
      alias: 'commonRootTouchStart',
      prop: 'onTouchStart',
    },
  ],
  id: 'common-root-id',
  lang: 'en-GB',
  ref: {
    alias: 'commonRootRef',
  },
  style: {
    name: '--common-root-prop',
    value: 'supported',
  },
  tabIndex: 0,
  title: 'Common root title',
} satisfies Cypress.CommonRootProps

describe('Link', () => {
  beforeEach(() => {
    useStoreRuntime().reset()
  })

  describe('accessibility', () => {
    it('REQ-001 renders native element semantics and has no automatic axe violations', () => {
      cy.mount(<Link />)

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })

  describe('native links', () => {
    it('REQ-001 PRD-001 renders a native anchor with href when navigable', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.getRootElement()
        .should('match', 'a')
        .and('have.attr', 'href', '/settings')
        .and('have.text', 'Settings')
    })

    it('REQ-002 REQ-004 exposes native link semantics and an accessible name from text content when href is present', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.get('a')
        .should('have.attr', 'href', '/settings')
        .and('have.text', 'Settings')
        .and('not.have.attr', 'role')
    })

    it('REQ-002 REQ-004 supports accessible naming through aria-label when href is present', () => {
      cy.mount(
        <Link
          aria-label="Open settings"
          href="/settings"
        >
          Settings
        </Link>,
      )

      cy.get('a')
        .should('have.attr', 'href', '/settings')
        .and('have.attr', 'aria-label', 'Open settings')
    })

    it('REQ-002 REQ-004 supports accessible naming through aria-labelledby when href is present', () => {
      cy.mount(
        <>
          <span id="link-label">Open settings</span>
          <Link
            aria-labelledby="link-label"
            href="/settings"
          >
            Settings
          </Link>
        </>,
      )

      cy.get('a')
        .should('have.attr', 'href', '/settings')
        .and('have.attr', 'aria-labelledby', 'link-label')
    })

    it('REQ-003 enables native hyperlink activation behaviour when href is present', () => {
      cy.mount(<Link href="#settings">Settings</Link>)

      cy.get('a').click()

      cy.location('hash').should('eq', '#settings')
    })

    it('REQ-005 does not render invalid interactive descendants as part of the base component output', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.get('a')
        .find(
          'a, button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
        )
        .should('have.length', 0)
    })

    it('REQ-006 does not set a redundant explicit link role on a native anchor with href', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.get('a')
        .should('have.attr', 'href', '/settings')
        .and('not.have.attr', 'role')
    })

    it('REQ-007 preserves supported native hyperlink attributes', () => {
      cy.mount(
        <Link
          download="settings.json"
          href="/settings"
          rel="noopener noreferrer"
          target="_blank"
        >
          Settings
        </Link>,
      )

      cy.get('a')
        .should('have.attr', 'href', '/settings')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer')
        .and('have.attr', 'download', 'settings.json')
    })

    it('REQ-010 omits hyperlink-only attributes when rendered without href', () => {
      cy.mount(<Link href={undefined}>Settings</Link>)

      cy.get('a').should('not.have.attr', 'href')
    })
  })

  describe('rendering customisation', () => {
    it('GPRD-005 supports common root props', () => {
      cy.mount(
        <Link {...createCommonRootProps(commonRootProps)}>Settings</Link>,
      )

      cy.getRootElement().assertSupportsProps(commonRootProps)
    })
  })

  describe('focus and state', () => {
    it('REQ-008 provides a visible focus indicator when the link receives keyboard focus', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.get('a').should('be.focused')
    })

    it('REQ-009 keeps author styling compatible with the browser focus-visible heuristic', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.get('a')
        .should('be.focused')
        .and(($link) => {
          expect($link[0].matches(':focus-visible')).to.equal(true)
        })
    })

    it('PRD-003 exposes a data-focus-visible state hook when keyboard focus is visibly indicated', () => {
      cy.mount(<Link href="/settings">Settings</Link>)

      cy.get('a').should('not.have.attr', 'data-focus-visible')

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.get('a')
        .should('be.focused')
        .and('have.attr', 'data-focus-visible', '')
    })

    it('PRD-004 exposes loading state semantics when the link is loading', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(<Link href="/settings">Settings</Link>)

      cy.get('a').should('not.have.attr', 'data-loading')
      cy.get('a').should('not.have.attr', 'aria-busy')
      cy.get('a').should('not.have.attr', 'aria-disabled')

      cy.mount(
        <Link
          href="#loading-link"
          isLoading
          onClick={onClick}
        >
          Settings
        </Link>,
      )

      cy.get('a')
        .should('have.attr', 'href', '#loading-link')
        .and('have.attr', 'data-loading', '')
        .and('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'aria-disabled', 'true')
        .click()
      cy.get('@onClick').should('have.been.calledOnce')
      cy.location('hash').should('not.eq', '#loading-link')
    })
  })

  describe('non-native roots', () => {
    it('PRD-002 REQ-011 REQ-012 REQ-014 supports the global as root substitution pattern for intrinsic elements', () => {
      cy.mount(<Link as="span">Settings</Link>)

      cy.getRootElement()
        .should('match', 'span')
        .and('have.text', 'Settings')
        .and('have.attr', 'role', 'link')
        .and('have.attr', 'tabindex', '0')
        .and('not.have.attr', 'aria-orientation')
    })

    it('REQ-013 supports keyboard activation through Enter for non-native roots', () => {
      cy.mount(<Link as="span">Settings</Link>)

      cy.getRootElement().then(($link) => {
        const clickSpy = cy.spy($link.get(0), 'click')

        cy.wrap($link).focus().trigger('keydown', { key: 'Enter' })

        cy.wrap(clickSpy).should('have.been.calledOnce')
      })
    })
  })
})
