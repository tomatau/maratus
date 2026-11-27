import { CUSTOM_CHECKBOX, mountCustomRoot } from './booleanControlField'

const DISABLED_CASES = [
  { control: {}, field: { isLoading: true }, state: 'loading' },
  { control: { disabled: true }, field: {}, state: 'disabled' },
] as const

const BLOCKED_CASES = [
  ...DISABLED_CASES.map((blocked) => ({ ...blocked, requirement: 'REQ-041' })),
  {
    control: {},
    field: { isReadOnly: true },
    requirement: 'REQ-043',
    state: 'readonly',
  },
]

describe('BooleanControl custom mode', () => {
  describe('focus', () => {
    it('REQ-037 puts an enabled custom root in the tab order', () => {
      mountCustomRoot({ control: CUSTOM_CHECKBOX })

      cy.getByTestId('control').should('have.attr', 'tabindex', '0')
    })

    DISABLED_CASES.forEach(({ control, field, state }) => {
      it(`PRD-012 takes a ${state} custom root out of the tab order`, () => {
        mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, ...control }, field })

        cy.getByTestId('control').should('have.attr', 'tabindex', '-1')
      })
    })

    it("PRD-013 keeps the consumer's tabIndex", () => {
      mountCustomRoot({
        control: { ...CUSTOM_CHECKBOX, disabled: true, tabIndex: 0 },
      })

      cy.getByTestId('control').should('have.attr', 'tabindex', '0')
    })
  })

  describe('activation', () => {
    // Focusing directly reaches a root that is out of the tab order.
    const PATHS = [
      {
        activate: () => cy.getByTestId('control').realClick(),
        activates: 'REQ-038',
        blockedWhenDisabled: 'REQ-040',
        blockedWhenReadOnly: 'REQ-042',
        path: 'pointer',
      },
      {
        activate: () => cy.getByTestId('control').focus().realPress('Space'),
        activates: 'REQ-039 PRD-014',
        blockedWhenDisabled: 'REQ-041',
        blockedWhenReadOnly: 'REQ-043',
        path: 'keyboard',
      },
    ]

    PATHS.forEach(
      ({
        activate,
        activates,
        blockedWhenDisabled,
        blockedWhenReadOnly,
        path,
      }) => {
        it(`${activates} activates an enabled custom root by ${path}`, () => {
          mountCustomRoot({
            control: { ...CUSTOM_CHECKBOX, onClick: cy.stub().as('activate') },
          })

          activate()

          cy.get('@activate').should('have.been.calledOnce')
        })

        DISABLED_CASES.forEach(({ control, field, state }) => {
          it(`${blockedWhenDisabled} GPRD-008 blocks a ${state} custom root by ${path}`, () => {
            mountCustomRoot({
              control: {
                ...CUSTOM_CHECKBOX,
                ...control,
                onClick: cy.stub().as('activate'),
              },
              field,
            })

            activate()

            cy.get('@activate').should('not.have.been.called')
          })
        })

        it(`${blockedWhenReadOnly} blocks a readonly custom root by ${path}`, () => {
          mountCustomRoot({
            control: { ...CUSTOM_CHECKBOX, onClick: cy.stub().as('activate') },
            field: { isReadOnly: true },
          })

          activate()

          cy.get('@activate').should('not.have.been.called')
        })
      },
    )

    const SCROLL_CASES = [
      { control: {}, field: {}, state: 'enabled' },
      ...BLOCKED_CASES,
    ]

    SCROLL_CASES.forEach(({ control, field, state }) => {
      it(`PRD-018 keeps Space from scrolling the page while the custom root is ${state}`, () => {
        mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, ...control }, field })
        cy.document().then((document) => {
          document.body.style.height = '200vh'
        })

        cy.getByTestId('control').focus().realPress('Space')

        cy.window().its('scrollY').should('equal', 0)
      })
    })

    BLOCKED_CASES.forEach(({ control, field, requirement, state }) => {
      it(`${requirement} dispatches no click from Space on a ${state} custom root`, () => {
        mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, ...control }, field })
        cy.getByTestId('control').then(([root]) => {
          root.addEventListener('click', cy.stub().as('click'))
        })

        cy.getByTestId('control').focus().realPress('Space')

        cy.get('@click').should('not.have.been.called')
      })
    })

    it('PRD-014 leaves Enter to the consumer', () => {
      mountCustomRoot({
        control: { ...CUSTOM_CHECKBOX, onClick: cy.stub().as('activate') },
      })

      cy.getByTestId('control').focus().realPress('Enter')

      cy.get('@activate').should('not.have.been.called')
    })

    it("PRD-015 GPRD-009 runs the consumer's key handler before activating", () => {
      const activate = cy.stub()
      const keyUp = cy.stub()

      mountCustomRoot({
        control: { ...CUSTOM_CHECKBOX, onClick: activate, onKeyUp: keyUp },
      })

      cy.getByTestId('control').focus().realPress('Space')

      cy.then(() => {
        expect(keyUp).to.have.been.calledBefore(activate)
      })
    })

    it('PRD-015 GPRD-010 skips activation when the consumer prevents default', () => {
      mountCustomRoot({
        control: {
          ...CUSTOM_CHECKBOX,
          onClick: cy.stub().as('activate'),
          onKeyUp: (event) => event.preventDefault(),
        },
      })

      cy.getByTestId('control').focus().realPress('Space')

      cy.get('@activate').should('not.have.been.called')
    })

    it("GPRD-008 skips the consumer's Space handler while loading", () => {
      mountCustomRoot({
        control: { ...CUSTOM_CHECKBOX, onKeyUp: cy.stub().as('keyUp') },
        field: { isLoading: true },
      })

      cy.getByTestId('control').focus().realPress('Space')

      cy.get('@keyUp').should('not.have.been.called')
    })
  })
})
