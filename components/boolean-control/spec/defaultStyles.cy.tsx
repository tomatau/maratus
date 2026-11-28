import {
  CUSTOM_CHECKBOX,
  mountCustomRoot,
  mountNativeCheckbox,
} from './booleanControlField'

const HOOK_COLOUR = 'rgb(1, 2, 3)'

const ROOT_CASES = [
  {
    mount: (className?: string) =>
      mountNativeCheckbox({ control: { className } }),
    root: 'native checkbox',
  },
  {
    mount: (className?: string) =>
      mountCustomRoot({ control: { ...CUSTOM_CHECKBOX, className } }),
    root: 'custom root',
  },
] satisfies {
  mount: (className?: string) => void
  root: string
}[]

describe('BooleanControl default styles', () => {
  for (const { mount, root } of ROOT_CASES) {
    it(`GPRD-005 applies the default, field, and consumer classes to the ${root}`, () => {
      mount('consumer-control')

      cy.getByTestId('control')
        .should('have.attr', 'class')
        .and('contain', 'booleanControl')
        .and('contain', 'fieldControl')
        .and('contain', 'consumer-control')
    })

    it(`REQ-048 applies the focus styles to the ${root} on keyboard focus`, () => {
      mount()

      cy.getRootElement().press(Cypress.Keyboard.Keys.TAB)

      cy.getByTestId('control').should('have.focus').assertStyleHook({
        property: 'outline-color',
        value: HOOK_COLOUR,
        variable: '--ara-boolean-control-focus',
      })
    })

    it(`REQ-049 leaves the focus styles off the ${root} on pointer focus`, () => {
      mount()

      cy.getByTestId('control').realClick()

      cy.getByTestId('control')
        .should('have.focus')
        .and(($control) => {
          const control = $control.get(0)
          control.style.setProperty('--ara-boolean-control-focus', HOOK_COLOUR)

          expect(getComputedStyle(control).outlineColor).not.to.equal(
            HOOK_COLOUR,
          )
        })
    })

    it(`PRD-025 gives the ${root} the browser's appearance by default`, () => {
      mount()

      cy.getByTestId('control').should('have.css', 'appearance', 'auto')
    })

    it(`PRD-025 takes the ${root}'s appearance from its token`, () => {
      mount()

      cy.getByTestId('control').assertStyleHook({
        property: 'appearance',
        value: 'none',
        variable: '--ara-boolean-control-appearance',
      })
    })
  }

  it('PRD-026 takes the native checkbox accent colour from the checked background token', () => {
    mountNativeCheckbox()

    cy.getByTestId('control').assertStyleHook({
      property: 'accent-color',
      value: HOOK_COLOUR,
      variable: '--ara-boolean-control-bg--checked',
    })
  })
})
