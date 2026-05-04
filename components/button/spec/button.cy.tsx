import type { ComponentPropsWithoutRef } from 'react'
import { Button } from '../src'

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

describe('Button', () => {
  describe('accessibility', () => {
    it('REQ-001 REQ-002 PRD-003 button renders native button semantics and has no automatic axe violations', () => {
      cy.mount(<Button>Press me</Button>)

      cy.get('button').should('have.text', 'Press me')

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })

  describe('rendering customisation', () => {
    it('GPRD-005 supports common root props', () => {
      cy.mount(
        <Button {...createCommonRootProps(commonRootProps)}>Press me</Button>,
      )

      cy.getRootElement().assertSupportsProps(commonRootProps)
    })
  })

  describe('native states and semantics', () => {
    it('REQ-013 button forwards an explicit type value', () => {
      cy.mount(<Button type="button">Press me</Button>)

      cy.get('button').should('have.attr', 'type', 'button')
    })

    it('REQ-004 REQ-008 PRD-001 button sets loading accessibility state', () => {
      cy.mount(<Button isLoading>Saving</Button>)

      cy.get('button')
        .should('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'aria-disabled', 'true')
        .and('be.disabled')
    })

    it('REQ-003 button uses native disabled behaviour by default', () => {
      cy.mount(<Button disabled>Disabled</Button>)

      cy.get('button')
        .should('have.attr', 'disabled', 'disabled')
        .and('have.attr', 'aria-disabled', 'true')
        .and('be.disabled')
    })

    it('REQ-007 disabled button exposes a distinct disabled appearance hook', () => {
      cy.mount(<Button disabled>Disabled</Button>)

      cy.get('button').should('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-005 REQ-008 button sets pressed accessibility state for toggle buttons', () => {
      cy.mount(
        <Button
          kind="toggle"
          pressed
        >
          Selected
        </Button>,
      )

      cy.get('button').should('have.attr', 'aria-pressed', 'true')
    })

    it('REQ-005 button supports mixed pressed state for toggle buttons', () => {
      cy.mount(
        <Button
          kind="toggle"
          pressed="mixed"
        >
          Mixed
        </Button>,
      )

      cy.get('button').should('have.attr', 'aria-pressed', 'mixed')
    })

    it('REQ-006 command buttons do not set aria-pressed', () => {
      cy.mount(<Button>Press me</Button>)

      cy.get('button').should('not.have.attr', 'aria-pressed')
    })

    it('REQ-003 REQ-004 PRD-002 button can remain focusable while disabled', () => {
      cy.mount(
        <Button
          disabled
          disabledBehavior="focusable"
        >
          Disabled but focusable
        </Button>,
      )

      cy.get('button')
        .should('have.attr', 'aria-disabled', 'true')
        .and('not.have.attr', 'disabled')
    })

    it('REQ-010 native button does not set a redundant explicit button role', () => {
      cy.mount(<Button>Press me</Button>)

      cy.get('button').should('not.have.attr', 'role')
    })
  })

  describe('activation', () => {
    it('REQ-017 enabled buttons activate through pointer interaction', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(<Button onClick={onClick}>Press me</Button>)

      cy.get('button').click()
      cy.get('@onClick').should('have.been.calledOnce')
    })

    it('REQ-018 enabled buttons activate through keyboard interaction', () => {
      const onEnter = cy.stub().as('onEnter')
      const onSpace = cy.stub().as('onSpace')

      cy.mount(
        <>
          <Button onClick={onEnter}>Enter</Button>
          <Button onClick={onSpace}>Space</Button>
        </>,
      )

      cy.contains('button', 'Enter').focus().realPress('Enter')
      cy.get('@onEnter').should('have.been.calledOnce')

      cy.contains('button', 'Space').focus().realPress('Space')
      cy.get('@onSpace').should('have.been.calledOnce')
    })

    it('REQ-019 disabled buttons do not activate through pointer interaction', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(
        <Button
          disabled
          disabledBehavior="focusable"
          onClick={onClick}
        >
          Press me
        </Button>,
      )

      cy.get('button').click({ force: true })
      cy.get('@onClick').should('not.have.been.called')
    })

    it('REQ-020 disabled buttons do not activate through keyboard interaction', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(
        <Button
          disabled
          disabledBehavior="focusable"
          onClick={onClick}
        >
          Press me
        </Button>,
      )

      cy.get('button').focus().realPress('Enter').realPress('Space')
      cy.get('@onClick').should('not.have.been.called')
    })
  })

  describe('form behaviour', () => {
    it('REQ-011 submit buttons allow normal HTML form submission behaviour', () => {
      const onSubmit = cy.stub().as('onSubmit')

      cy.mount(
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(event)
          }}
        >
          <Button type="submit">Submit</Button>
        </form>,
      )

      cy.get('button').click()
      cy.get('@onSubmit').should('have.been.calledOnce')
    })

    it('REQ-012 reset buttons allow normal HTML form reset behaviour', () => {
      const onReset = cy.stub().as('onReset')

      cy.mount(
        <form onReset={onReset}>
          <input
            defaultValue="before"
            id="field"
          />
          <Button type="reset">Reset</Button>
        </form>,
      )

      cy.get('#field').clear().type('after')
      cy.get('button').click()

      cy.get('#field').should('have.value', 'before')
      cy.get('@onReset').should('have.been.calledOnce')
    })

    it('REQ-013 buttons without a type use the HTML missing-value default', () => {
      const onSubmit = cy.stub().as('onSubmit')

      cy.mount(
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(event)
          }}
        >
          <Button>Submit</Button>
        </form>,
      )

      cy.get('button').click()
      cy.get('@onSubmit').should('have.been.calledOnce')
    })

    it('REQ-014 submit buttons support HTML form submission attributes', () => {
      cy.mount(
        <Button
          form="settings-form"
          formAction="/save"
          formEncType="multipart/form-data"
          formMethod="post"
          formNoValidate
          formTarget="_blank"
          type="submit"
        >
          Submit
        </Button>,
      )

      cy.get('button')
        .should('have.attr', 'form', 'settings-form')
        .and('have.attr', 'formaction', '/save')
        .and('have.attr', 'formenctype', 'multipart/form-data')
        .and('have.attr', 'formmethod', 'post')
        .and('have.attr', 'formnovalidate', '')
        .and('have.attr', 'formtarget', '_blank')
    })

    it('REQ-015 buttons support HTML form association attributes', () => {
      const onSubmit = cy.stub().as('onSubmit')

      cy.mount(
        <>
          <form
            id="linked-form"
            onSubmit={(event) => {
              event.preventDefault()

              const submitter = event.nativeEvent.submitter

              if (!(submitter instanceof HTMLButtonElement)) {
                throw new Error('Expected button submitter')
              }

              const submittedValue = String(
                new FormData(event.currentTarget, submitter).get('intent') ??
                  '',
              )

              onSubmit(submittedValue)
            }}
          />
          <Button
            form="linked-form"
            name="intent"
            type="submit"
            value="save"
          >
            Save
          </Button>
        </>,
      )

      cy.get('button')
        .should('have.attr', 'form', 'linked-form')
        .and('have.attr', 'name', 'intent')
        .and('have.attr', 'value', 'save')

      cy.get('button').click()
      cy.get('@onSubmit').should('have.been.calledOnceWith', 'save')
    })
  })

  describe('focus visibility', () => {
    it('REQ-021 PRD-004 keyboard focus exposes a focus-visible state hook', () => {
      cy.mount(<Button>Press me</Button>)

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.get('button')
        .should('be.focused')
        .and('have.attr', 'data-focus-visible', '')
    })

    it('REQ-022 pointer focus does not expose the focus-visible state hook', () => {
      cy.mount(<Button>Press me</Button>)

      cy.get('button').click()

      cy.get('button')
        .should('be.focused')
        .and('not.have.attr', 'data-focus-visible')
    })

    it('REQ-021 native button remains compatible with the browser focus-visible pseudo-class', () => {
      cy.mount(<Button>Press me</Button>)

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.get('button')
        .should('be.focused')
        .and(($button) => {
          expect($button[0].matches(':focus-visible')).to.equal(true)
        })
    })
  })

  describe('non-native roots', () => {
    it('GPRD-001 GPRD-002 REQ-023 REQ-024 REQ-027 non-native intrinsic roots expose button semantics when rendered with as', () => {
      cy.mount(<Button as="div">Press me</Button>)

      cy.getRootElement()
        .should('have.attr', 'role', 'button')
        .and('have.attr', 'tabindex', '0')
        .and('not.have.attr', 'disabled')
    })

    it('GPRD-002 REQ-023 REQ-024 REQ-027 custom component roots are supported through as', () => {
      function AnchorRoot(props: ComponentPropsWithoutRef<'a'>) {
        return (
          <a
            href="/settings"
            {...props}
          />
        )
      }

      cy.mount(<Button as={AnchorRoot}>Settings</Button>)

      cy.getRootElement()
        .should('have.prop', 'tagName', 'A')
        .and('have.attr', 'href', '/settings')
        .and('have.attr', 'role', 'button')
        .and('have.attr', 'tabindex', '0')
        .and('not.have.attr', 'disabled')
    })

    it('REQ-025 non-native roots activate through keyboard interaction', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(
        <Button
          as="div"
          onClick={onClick}
        >
          Press me
        </Button>,
      )

      cy.getRootElement().focus().realPress('Enter').realPress('Space')
      cy.get('@onClick').should('have.callCount', 2)
    })

    it('REQ-026 non-native disabled roots expose disabled semantics and do not activate through pointer or keyboard interaction', () => {
      const onClick = cy.stub().as('onClick')

      cy.mount(
        <Button
          as="div"
          disabled
          onClick={onClick}
        >
          Press me
        </Button>,
      )

      cy.getRootElement()
        .should('have.attr', 'aria-disabled', 'true')
        .click({ force: true })
        .focus()
        .realPress('Enter')
        .realPress('Space')

      cy.get('@onClick').should('not.have.been.called')
    })

    it('REQ-028 non-native roots do not expose native button-only attributes', () => {
      cy.mount(
        <Button
          as="div"
          type="submit"
        >
          Submit
        </Button>,
      )

      cy.getRootElement().should('not.have.attr', 'type')
      cy.getRootElement().should('not.have.attr', 'form')
      cy.getRootElement().should('not.have.attr', 'formaction')
      cy.getRootElement().should('not.have.attr', 'formenctype')
      cy.getRootElement().should('not.have.attr', 'formmethod')
      cy.getRootElement().should('not.have.attr', 'formnovalidate')
      cy.getRootElement().should('not.have.attr', 'formtarget')
    })
  })
})
