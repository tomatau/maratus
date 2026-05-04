import type { HTMLAttributes } from 'react'
import { Separator } from '../src'

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

function CustomRoot(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-testid="custom-root"
      {...props}
    />
  )
}

describe('Separator', () => {
  describe('accessibility', () => {
    it('REQ-001 REQ-002 renders with horizontal semantics and has no automatic axe violations', () => {
      cy.mount(<Separator />)

      cy.get('hr').should('not.have.attr', 'aria-hidden', 'true')

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })

  describe('semantics', () => {
    it('REQ-003 supports decorative mode', () => {
      cy.mount(<Separator isDecorative />)

      cy.get('hr').should('have.attr', 'aria-hidden', 'true')
    })

    it('REQ-004 does not set separator role on horizontal hr output', () => {
      cy.mount(<Separator />)

      cy.get('hr').should('not.have.attr', 'role', 'separator')
    })

    it('REQ-005 allows presentation roles on horizontal hr output', () => {
      cy.mount(<Separator role="presentation" />)

      cy.get('hr').should('have.attr', 'role', 'presentation')
    })

    it('REQ-006 supports vertical orientation', () => {
      cy.mount(<Separator orientation="vertical" />)

      cy.getRootElement()
        .should('have.attr', 'role', 'separator')
        .and('have.attr', 'aria-orientation', 'vertical')
    })
  })

  describe('rendering customisation', () => {
    it('GPRD-005 supports common root props', () => {
      cy.mount(<Separator {...createCommonRootProps(commonRootProps)} />)

      cy.getRootElement().assertSupportsProps(commonRootProps)
    })

    it('GPRD-001 GPRD-002 REQ-010 supports horizontal intrinsic roots through as', () => {
      cy.mount(<Separator as="div" />)

      cy.getRootElement()
        .should('have.attr', 'role', 'separator')
        .and('not.have.attr', 'aria-orientation')
    })

    it('GPRD-002 REQ-010 supports custom component roots through as', () => {
      cy.mount(<Separator as={CustomRoot} />)

      cy.getByTestId('custom-root')
        .should('have.attr', 'role', 'separator')
        .and('not.have.attr', 'aria-orientation')
    })

    it('GPRD-002 REQ-006 supports vertical custom component roots through as', () => {
      cy.mount(
        <Separator
          as={CustomRoot}
          orientation="vertical"
        />,
      )

      cy.getByTestId('custom-root')
        .should('have.attr', 'role', 'separator')
        .and('have.attr', 'aria-orientation', 'vertical')
    })
  })
})
