import {
  CHECKBOXES,
  CONSUMER_NAME,
  DISABLED_CHOICE,
  ENABLED_CHOICES,
  FIELD_NAME,
  FIRST_CHOICE,
  REQUIRED_FIRST_CHECKBOX,
  SECOND_CHOICE,
  getCheckboxes,
  mountCheckboxes,
} from './checkboxesField'

describe('ChoicesControl checkboxes mode', () => {
  describe('semantics', () => {
    it('REQ-001 REQ-002 contains checkbox inputs in a group', () => {
      mountCheckboxes()

      cy.getByTestId('control').should('have.attr', 'role', 'group')
      getCheckboxes()
        .should('have.length', CHECKBOXES.length)
        .and('have.prop', 'type', 'checkbox')
    })

    it('REQ-003 PRD-002 names the group from the field label', () => {
      mountCheckboxes()

      cy.getByTestId('control').assertReferences('aria-labelledby', ['label'])
    })

    it('REQ-007 names each checkbox from its option label', () => {
      mountCheckboxes()

      getCheckboxes().each(($checkbox, index) => {
        const checkbox = $checkbox.get(0) as HTMLInputElement
        expect(checkbox.labels?.[0]?.textContent).to.equal(
          CHECKBOXES[index]?.value,
        )
      })
    })

    it('REQ-008 checks only the selected choices', () => {
      mountCheckboxes({ initialValues: [FIRST_CHOICE] })

      cy.getByTestId(FIRST_CHOICE).should('be.checked')
      cy.getByTestId(SECOND_CHOICE).should('not.be.checked')
    })

    it('REQ-015 PRD-002 references the description from the group', () => {
      mountCheckboxes()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it('PRD-014 uses the field name unless a checkbox supplies its own', () => {
      mountCheckboxes({
        checkboxes: [
          { isDisabled: false, isRequired: false, value: FIRST_CHOICE },
          {
            isDisabled: false,
            isRequired: false,
            name: CONSUMER_NAME,
            value: SECOND_CHOICE,
          },
        ],
      })

      cy.getByTestId(FIRST_CHOICE).should('have.prop', 'name', FIELD_NAME)
      cy.getByTestId(SECOND_CHOICE).should('have.prop', 'name', CONSUMER_NAME)
    })
  })

  describe('required', () => {
    it('REQ-004 REQ-016 keeps a required field off the group and its checkboxes', () => {
      mountCheckboxes({ fieldState: { isRequired: true } })

      cy.getByTestId('control').should('not.have.attr', 'aria-required')
      getCheckboxes().should('have.prop', 'required', false)
    })

    it('REQ-034 keeps a consumer-required checkbox required', () => {
      mountCheckboxes({ checkboxes: REQUIRED_FIRST_CHECKBOX })

      cy.getByTestId(FIRST_CHOICE).should('have.prop', 'required', true)
      cy.getByTestId(SECOND_CHOICE).should('have.prop', 'required', false)
    })
  })

  describe('readonly', () => {
    beforeEach(() => {
      mountCheckboxes({ fieldState: { isReadOnly: true } })
    })

    it('REQ-019 REQ-039 sets aria-readonly instead of readonly on each checkbox', () => {
      getCheckboxes().should('not.have.attr', 'readonly')
      getCheckboxes().should('have.attr', 'aria-readonly', 'true')
    })

    it('REQ-020 omits aria-readonly on the group', () => {
      cy.getByTestId('control').should('not.have.attr', 'aria-readonly')
    })

    it('REQ-040 keeps enabled checkboxes enabled', () => {
      for (const choice of ENABLED_CHOICES) {
        cy.getByTestId(choice).should('be.enabled')
      }
    })
  })

  describe('readonly interaction', () => {
    beforeEach(() => {
      mountCheckboxes({
        fieldState: { isReadOnly: true },
        initialValues: [FIRST_CHOICE],
      })
    })

    it('REQ-044 keeps each checkbox unchanged when clicked', () => {
      cy.getByTestId(FIRST_CHOICE).realClick()
      cy.getByTestId(SECOND_CHOICE).realClick()

      cy.getByTestId(FIRST_CHOICE).should('be.checked')
      cy.getByTestId(SECOND_CHOICE).should('not.be.checked')
    })

    it('REQ-045 keeps each checkbox unchanged when Space is pressed', () => {
      cy.getByTestId(FIRST_CHOICE).focus().realPress('Space')
      cy.getByTestId(SECOND_CHOICE).focus().realPress('Space')

      cy.getByTestId(FIRST_CHOICE).should('be.checked')
      cy.getByTestId(SECOND_CHOICE).should('not.be.checked')
    })
  })

  describe('loading', () => {
    beforeEach(() => {
      mountCheckboxes({ fieldState: { isLoading: true } })
    })

    it('REQ-026 REQ-027 marks the group busy and disabled', () => {
      cy.getByTestId('control').should('have.attr', 'aria-busy', 'true')
      cy.getByTestId('control').should('have.attr', 'aria-disabled', 'true')
    })

    it('REQ-028 disables every checkbox', () => {
      getCheckboxes().should('be.disabled')
    })
  })

  describe('interaction', () => {
    it('REQ-009 REQ-014 toggles one checkbox without changing the others', () => {
      mountCheckboxes({ initialValues: [FIRST_CHOICE] })

      cy.getByTestId(SECOND_CHOICE).click()

      cy.getByTestId(SECOND_CHOICE).should('be.checked')
      cy.getByTestId(FIRST_CHOICE).should('be.checked')
    })

    for (const choice of ENABLED_CHOICES) {
      it(`REQ-010 toggles ${choice} with Space`, () => {
        mountCheckboxes()

        cy.getByTestId(choice).focus().realPress('Space')
        cy.getByTestId(choice).should('be.checked')

        cy.getByTestId(choice).realPress('Space')
        cy.getByTestId(choice).should('not.be.checked')
      })
    }

    it('REQ-011 does not toggle a disabled checkbox on click', () => {
      mountCheckboxes()

      cy.getByTestId(DISABLED_CHOICE).realClick()

      cy.getByTestId(DISABLED_CHOICE).should('not.be.checked')
    })

    it('REQ-012 skips the disabled checkbox in keyboard navigation', () => {
      mountCheckboxes()

      cy.getByTestId(SECOND_CHOICE).focus().realPress('Tab')
      cy.realPress('Space')

      cy.getByTestId(DISABLED_CHOICE).should('not.be.checked')
    })
  })

  describe('accessibility', () => {
    it('REQ-001 REQ-002 REQ-003 REQ-004 REQ-007 REQ-020 REQ-039 has no violations', () => {
      mountCheckboxes({
        fieldState: { isReadOnly: true, isRequired: true },
        initialValues: [FIRST_CHOICE],
      })

      cy.injectAxeAtRoot()
      cy.auditA11y()
    })
  })
})
