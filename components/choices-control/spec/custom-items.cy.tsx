import {
  DISABLED_ITEM,
  ENABLED_ITEMS,
  FIRST_ITEM,
  ITEMS,
  SECOND_ITEM,
  getItems,
  mountCustomItems,
} from './customItemsField'

const CUSTOM_ITEMS_MODES = [
  {
    itemRole: 'checkbox',
    mode: 'checkbox-items',
    requirements: {
      a11y: 'REQ-001 REQ-003 REQ-004 REQ-020 REQ-021 REQ-022 REQ-024',
      disabledItem: 'REQ-023',
      itemRole: 'REQ-021',
      label: 'REQ-003',
      selection: 'REQ-022',
    },
    selectionAttribute: 'aria-checked',
  },
  {
    itemRole: 'option',
    mode: 'listbox',
    requirements: {
      a11y: 'REQ-005 REQ-006 REQ-013 REQ-035 REQ-036 REQ-043',
      disabledItem: 'REQ-043',
      itemRole: 'REQ-006',
      label: 'REQ-036',
      selection: 'REQ-006',
    },
    selectionAttribute: 'aria-selected',
  },
] as const

for (const testCase of CUSTOM_ITEMS_MODES) {
  const { mode, requirements } = testCase

  describe(`ChoicesControl ${mode} mode`, () => {
    it(`${requirements.label} labels the container with the field label`, () => {
      mountCustomItems({ mode })

      cy.getByTestId('control').assertReferences('aria-labelledby', ['label'])
    })

    it('REQ-015 references the description from the container', () => {
      mountCustomItems({ mode })

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it(`${requirements.itemRole} gives each item the ${testCase.itemRole} role`, () => {
      mountCustomItems({ mode })

      getItems()
        .should('have.length', ITEMS.length)
        .and('have.attr', 'role', testCase.itemRole)
    })

    it(`${requirements.selection} marks only the selected items with ${testCase.selectionAttribute}`, () => {
      mountCustomItems({ initialValues: [FIRST_ITEM], mode })

      cy.getByTestId(FIRST_ITEM).should(
        'have.attr',
        testCase.selectionAttribute,
        'true',
      )
      cy.getByTestId(SECOND_ITEM).should(
        'have.attr',
        testCase.selectionAttribute,
        'false',
      )
    })

    it(`${requirements.disabledItem} marks a disabled item`, () => {
      mountCustomItems({ mode })

      cy.getByTestId(DISABLED_ITEM).should('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-040 keeps enabled items enabled when readonly', () => {
      mountCustomItems({ fieldState: { isReadOnly: true }, mode })

      for (const item of ENABLED_ITEMS) {
        cy.getByTestId(item).should('not.have.attr', 'aria-disabled')
      }
    })

    describe('loading', () => {
      beforeEach(() => {
        mountCustomItems({ fieldState: { isLoading: true }, mode })
      })

      it('REQ-026 REQ-027 marks the container busy and disabled', () => {
        cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
        cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
      })

      it('REQ-029 marks every item disabled', () => {
        getItems().should('have.attr', 'aria-disabled', 'true')
      })
    })

    it(`${requirements.a11y} has no violations`, () => {
      mountCustomItems({
        fieldState: { isReadOnly: true, isRequired: true },
        initialValues: [FIRST_ITEM],
        mode,
      })

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })
}
