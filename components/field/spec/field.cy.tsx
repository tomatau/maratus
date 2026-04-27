import { Control, Description, ErrorMessage, FieldRoot, Label } from '../src'

describe('Field', () => {
  it('renders the minimum field contract with no automatic axe violations', () => {
    cy.mount(
      <FieldRoot
        name="email"
        label="Email"
        description="Email description"
      >
        <Label />
        <Control>
          {(props) => (
            <input
              type="text"
              {...props}
            />
          )}
        </Control>
        <Description />
      </FieldRoot>,
    )

    cy.injectAxeAtRoot()
    cy.auditA11y()
  })

  it('PRD-001 exports the initial field primitive set', () => {
    expect(FieldRoot).to.be.a('function')
    expect(Control).to.be.a('function')
    expect(Label).to.be.a('function')
    expect(Description).to.be.a('function')
    expect(ErrorMessage).to.be.a('function')
  })

  it('REQ-001 PRD-003 generates document-unique ids for each field relationship target', () => {
    const errorMap = new Map([['valueMissing', 'Enter an email address.']])

    cy.mount(
      <>
        <FieldRoot
          activeErrors={['valueMissing']}
          description="Used for receipts."
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Label data-testid="first-label" />
          <Control>
            {(controlProps) => (
              <input
                data-testid="first-control"
                {...controlProps}
              />
            )}
          </Control>
          <Description data-testid="first-desc" />
          <ErrorMessage data-testid="first-error" />
        </FieldRoot>
        <FieldRoot
          activeErrors={['valueMissing']}
          description="Used for account recovery."
          errorMap={errorMap}
          label="Backup email"
          name="backupEmail"
        >
          <Label data-testid="second-label" />
          <Control>
            {(controlProps) => (
              <input
                data-testid="second-control"
                {...controlProps}
              />
            )}
          </Control>
          <Description data-testid="second-desc" />
          <ErrorMessage data-testid="second-error" />
        </FieldRoot>
      </>,
    )

    cy.getByTestId('first-control').invoke('attr', 'id').as('firstControlId')
    cy.getByTestId('second-control').invoke('attr', 'id').as('secondControlId')

    cy.getByTestId('first-desc').invoke('attr', 'id').as('firstDescId')
    cy.getByTestId('second-desc').invoke('attr', 'id').as('secondDescId')

    cy.getByTestId('first-error').invoke('attr', 'id').as('firstErrorId')
    cy.getByTestId('second-error').invoke('attr', 'id').as('secondErrorId')

    cy.then(function () {
      const ids = [
        this.firstControlId,
        this.secondControlId,
        this.firstDescId,
        this.secondDescId,
        this.firstErrorId,
        this.secondErrorId,
      ]

      ids.forEach((id) => {
        expect(id).to.be.a('string').and.not.equal('')
      })
      expect(new Set(ids)).to.have.length(ids.length)
    })
  })

  it('REQ-002 REQ-003 REQ-004 PRD-003 PRD-004 PRD-005 uses an explicit control id for label and control wiring', () => {
    cy.mount(
      <FieldRoot
        controlId="email-control"
        label="Email"
        name="email"
      >
        <Label data-testid="label" />
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              {...controlProps}
            />
          )}
        </Control>
      </FieldRoot>,
    )

    cy.getByTestId('label')
      .should('have.text', 'Email')
      .and('have.attr', 'for', 'email-control')
    cy.getByTestId('control')
      .should('have.attr', 'id', 'email-control')
      .and('have.attr', 'name', 'email')
  })

  it('REQ-002 REQ-003 PRD-003 PRD-004 PRD-005 associates the label with the generated field control id', () => {
    cy.mount(
      <FieldRoot
        label="Email"
        name="email"
      >
        <Label data-testid="label" />
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              {...controlProps}
            />
          )}
        </Control>
      </FieldRoot>,
    )

    cy.getByTestId('label').invoke('attr', 'for').as('labelFor')
    cy.getByTestId('control').invoke('attr', 'id').as('controlId')

    cy.then(function () {
      expect(this.labelFor).to.equal(this.controlId)
    })
  })

  it('REQ-005 REQ-006 PRD-003 PRD-004 wires description content to the field control', () => {
    cy.mount(
      <FieldRoot
        description="Used for receipts."
        label="Email"
        name="email"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              {...controlProps}
            />
          )}
        </Control>
        <Description data-testid="description" />
      </FieldRoot>,
    )

    cy.getByTestId('description')
      .should('have.text', 'Used for receipts.')
      .and('have.attr', 'id')
      .then((descriptionId) => {
        cy.getByTestId('control').should(
          'have.attr',
          'aria-describedby',
          descriptionId,
        )
      })
  })

  it('REQ-007 REQ-008 REQ-009 REQ-011 PRD-003 PRD-004 wires visible errors to the field control', () => {
    const errorMap = new Map([['valueMissing', 'Enter an email address.']])

    cy.mount(
      <FieldRoot
        activeErrors={['valueMissing']}
        errorMap={errorMap}
        label="Email"
        name="email"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              {...controlProps}
            />
          )}
        </Control>
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId('error')
      .should('have.text', 'Enter an email address.')
      .and('have.attr', 'role', 'alert')
    cy.getByTestId('error')
      .invoke('attr', 'id')
      .then((errorId) => {
        cy.getByTestId('control')
          .should('have.attr', 'aria-invalid', 'true')
          .and('have.attr', 'aria-errormessage', errorId)
      })
  })

  it('REQ-007 REQ-008 REQ-009 REQ-011 REQ-014 wires native validation errors to the field control', () => {
    const errorMap = new Map([['valueMissing', 'Enter an email address.']])

    cy.mount(
      <FieldRoot
        errorMap={errorMap}
        label="Email"
        name="email"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              required
              {...controlProps}
            />
          )}
        </Control>
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId<HTMLInputElement>('control').then(($control) => {
      const isControlValid = $control.get(0).checkValidity()
      cy.log('Call check validity returned', isControlValid)
    })

    cy.getByTestId('error')
      .should('have.text', 'Enter an email address.')
      .and('have.attr', 'role', 'alert')
    cy.getByTestId('error')
      .invoke('attr', 'id')
      .then((errorId) => {
        cy.getByTestId('control')
          .should('have.attr', 'aria-invalid', 'true')
          .and('have.attr', 'aria-errormessage', errorId)
      })
  })

  it('REQ-010 omits aria-errormessage when the field has no visible errors', () => {
    const errorMap = new Map([['valueMissing', 'Enter an email address.']])

    cy.mount(
      <FieldRoot
        errorMap={errorMap}
        label="Email"
        name="email"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              {...controlProps}
            />
          )}
        </Control>
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
    cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    cy.getByTestId('error').should('not.have.attr', 'role')
  })

  it('REQ-012 preserves native form control attributes and constraint validation behaviour', () => {
    cy.mount(
      <FieldRoot
        label="Age"
        name="age"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              autoComplete="bday-year"
              disabled={false}
              max={120}
              maxLength={3}
              min={18}
              minLength={2}
              pattern="[0-9]+"
              readOnly={false}
              required
              type="number"
              {...controlProps}
            />
          )}
        </Control>
      </FieldRoot>,
    )

    cy.getByTestId<HTMLInputElement>('control').then(($control) => {
      const control = $control.get(0)

      expect(control, 'native input element').to.be.instanceOf(HTMLInputElement)
      expect(control.name, 'field name').to.equal('age')
      expect(control.type, 'input type').to.equal('number')
      expect(control.required, 'required').to.equal(true)
      expect(control.disabled, 'disabled').to.equal(false)
      expect(control.readOnly, 'read only').to.equal(false)
      expect(control.min, 'minimum').to.equal('18')
      expect(control.max, 'maximum').to.equal('120')
      expect(control.minLength, 'minimum length').to.equal(2)
      expect(control.maxLength, 'maximum length').to.equal(3)
      expect(control.pattern, 'pattern').to.equal('[0-9]+')
      expect(control.autocomplete, 'autocomplete').to.equal('bday-year')
      expect(control.validity.valueMissing, 'valueMissing').to.equal(true)
    })
  })

  it('REQ-013 PRD-003 PRD-004 PRD-007 uses activeErrors as the current active error keys', () => {
    const errorMap = new Map([
      ['valueMissing', 'Enter an email address.'],
      ['typeMismatch', 'Enter a valid email address.'],
      ['tooShort', 'Use at least 8 characters.'],
      ['customServerError', 'This email is already registered.'],
    ])

    cy.mount(
      <FieldRoot
        activeErrors={['typeMismatch', 'customServerError']}
        errorMap={errorMap}
        label="Email"
        name="email"
      >
        <Control>
          {(controlProps) => (
            <input
              data-testid="control"
              required
              type="email"
              {...controlProps}
            />
          )}
        </Control>
        <ErrorMessage data-testid="error" />
      </FieldRoot>,
    )

    cy.getByTestId('error')
      .find('p')
      .should('have.length', 2)
      .eq(0)
      .should('have.text', 'Enter a valid email address.')
      .and('have.attr', 'class')
    cy.getByTestId('error')
      .find('p')
      .eq(1)
      .should('have.text', 'This email is already registered.')
      .and('have.attr', 'class')
    cy.getByTestId('error')
      .should('not.contain', 'Enter an email address.')
      .and('not.contain', 'Use at least 8 characters.')
    cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
  })
})
