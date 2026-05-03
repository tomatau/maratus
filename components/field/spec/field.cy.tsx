import type {
  ControlRenderArgs,
  ControlRole,
  FieldErrorKey,
  FieldErrorPolicy,
  ValidityErrorKey,
} from '../src'
import type { ReactNode } from 'react'
import { Control, Description, ErrorMessage, FieldRoot, Label } from '../src'

type Stub = sinon.SinonStub

describe('Field', () => {
  describe('accessibility and exports', () => {
    it('renders the minimum field contract with no automatic axe violations', () => {
      cy.mount(
        <FieldRoot
          name="email"
          label="Email"
          description="Email description"
        >
          <Label />
          <Control>
            {({ controlProps }) => (
              <input
                type="text"
                {...controlProps}
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
  })

  describe('relationships', () => {
    it('REQ-001 PRD-002 generates document-unique ids for each field relationship target', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <>
          <FieldRoot
            activeErrors={new Set(['valueMissing'])}
            description="Used for receipts."
            errorMap={errorMap}
            label="Email"
            name="email"
          >
            <Label data-testid="first-label" />
            <Control>
              {({ controlProps }) => (
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
            activeErrors={new Set(['valueMissing'])}
            description="Used for account recovery."
            errorMap={errorMap}
            label="Backup email"
            name="backupEmail"
          >
            <Label data-testid="second-label" />
            <Control>
              {({ controlProps }) => (
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
      cy.getByTestId('second-control')
        .invoke('attr', 'id')
        .as('secondControlId')

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

    it('REQ-002 REQ-003 REQ-004 PRD-002 PRD-003 PRD-004 uses an explicit control id for label and control wiring', () => {
      cy.mount(
        <FieldRoot
          controlId="email-control"
          label="Email"
          name="email"
        >
          <Label data-testid="label" />
          <Control>
            {({ controlProps }) => (
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

    it('REQ-002 REQ-003 PRD-002 PRD-003 PRD-004 associates the label with the generated field control id', () => {
      cy.mount(
        <FieldRoot
          label="Email"
          name="email"
        >
          <Label data-testid="label" />
          <Control>
            {({ controlProps }) => (
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

    it('REQ-005 REQ-006 PRD-002 PRD-003 wires description content to the field control', () => {
      cy.mount(
        <FieldRoot
          description="Used for receipts."
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
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

    it('REQ-007 REQ-008 REQ-009 REQ-011 PRD-002 PRD-003 wires visible errors to the field control', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          activeErrors={new Set(['valueMissing'])}
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
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
  })

  describe('rendering customisation', () => {
    it('GPRD-005 applies default and consumer class names to field elements', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          activeErrors={new Set(['valueMissing'])}
          className="custom-field"
          description="Used for receipts."
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Label
            className="custom-label"
            data-testid="label"
          />
          <Control className="custom-control">
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
          <Description
            className="custom-description"
            data-testid="description"
          />
          <ErrorMessage
            className="custom-error"
            data-testid="error"
          />
        </FieldRoot>,
      )

      cy.getByTestId('label')
        .should('have.attr', 'class')
        .and('contain', 'label')
        .and('contain', 'custom-label')
      cy.getByTestId('control')
        .should('have.attr', 'class')
        .and('contain', 'control')
        .and('contain', 'custom-control')
      cy.getByTestId('description')
        .should('have.attr', 'class')
        .and('contain', 'description')
        .and('contain', 'custom-description')
      cy.getByTestId('error')
        .should('have.attr', 'class')
        .and('contain', 'errorMessageRoot')
        .and('contain', 'custom-error')
      cy.getByTestId('error')
        .find('p')
        .should('have.attr', 'class')
        .and('contain', 'errorMessage')
    })

    it('PRD-012 allows ErrorMessage to render visible errors with renderChildren', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          activeErrors={new Set(['valueMissing'])}
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <ErrorMessage
            data-testid="error"
            renderChildren={({ children, className, errorKey, key }) => (
              <span
                className={className}
                data-error-key={errorKey}
                data-render-key={key}
                data-testid="custom-error"
                key={key}
              >
                {children}
              </span>
            )}
          />
        </FieldRoot>,
      )

      cy.getByTestId('error')
        .should('have.attr', 'role', 'alert')
        .find('p')
        .should('have.length', 0)
      cy.getByTestId('custom-error')
        .should('have.text', 'Enter an email address.')
        .and('have.attr', 'class')
      cy.getByTestId('custom-error')
        .and('have.attr', 'data-error-key', 'valueMissing')
        .and('have.attr', 'data-render-key', 'valueMissing')
    })

    it('PRD-013 supports root substitution for the field root', () => {
      cy.mount(
        <FieldRoot
          as="section"
          data-testid="field"
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
        </FieldRoot>,
      )

      cy.getByTestId('field').should('match', 'section')
      cy.getByTestId('control').should('have.attr', 'name', 'email')
    })

    it('REQ-005 REQ-006 PRD-013 supports root substitution for description relationship wiring', () => {
      cy.mount(
        <FieldRoot
          description="Used for receipts."
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
          <Description
            as="span"
            data-testid="description"
          />
        </FieldRoot>,
      )

      cy.getByTestId('description')
        .should('match', 'span')
        .and('have.text', 'Used for receipts.')
        .and('have.attr', 'id')
        .then((descriptionId) => {
          cy.getByTestId('control').should(
            'have.attr',
            'aria-describedby',
            descriptionId,
          )
        })
    })

    it('REQ-007 REQ-008 REQ-009 REQ-011 PRD-013 supports root substitution for error relationship wiring', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          activeErrors={new Set(['valueMissing'])}
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
          <ErrorMessage
            as="section"
            data-testid="error"
          />
        </FieldRoot>,
      )

      cy.getByTestId('error')
        .should('match', 'section')
        .and('have.text', 'Enter an email address.')
        .and('have.attr', 'role', 'alert')
      cy.getByTestId('error')
        .invoke('attr', 'id')
        .then((errorId) => {
          cy.getByTestId('control')
            .should('have.attr', 'aria-invalid', 'true')
            .and('have.attr', 'aria-errormessage', errorId)
        })
    })
  })

  describe('native controls', () => {
    it('REQ-007 REQ-008 REQ-009 REQ-011 REQ-014 wires native validation errors to the field control', () => {
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
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
      const errorMap = new Map<ValidityErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      cy.mount(
        <FieldRoot
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
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
            {({ controlProps }) => (
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

        expect(control, 'native input element').to.be.instanceOf(
          HTMLInputElement,
        )
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

    it('REQ-016 REQ-018 PRD-015 exposes required state to the label and native control', () => {
      cy.mount(
        <FieldRoot
          isRequired
          label="Email"
          name="email"
        >
          <Label data-testid="label" />
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
        </FieldRoot>,
      )

      cy.getByTestId('label').should('have.attr', 'data-required')
      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.required, 'required').to.equal(true)
        expect(control.validity.valueMissing, 'valueMissing').to.equal(true)
      })
    })

    it('REQ-017 REQ-019 PRD-015 exposes readonly state to the label and native control', () => {
      cy.mount(
        <FieldRoot
          isReadOnly
          label="Email"
          name="email"
        >
          <Label data-testid="label" />
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                type="text"
                {...controlProps}
              />
            )}
          </Control>
        </FieldRoot>,
      )

      cy.getByTestId('label').should('have.attr', 'data-readonly')
      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control.readOnly, 'read only').to.equal(true)
      })
    })

    it('REQ-031 PRD-019 exposes loading state to the field root, label, and native control', () => {
      cy.mount(
        <FieldRoot
          data-testid="field"
          isLoading
          label="Email"
          name="email"
        >
          <Label data-testid="label" />
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                {...controlProps}
              />
            )}
          </Control>
        </FieldRoot>,
      )

      cy.getByTestId('field')
        .should('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'data-loading')
      cy.getByTestId('label').should('have.attr', 'data-loading')
      cy.getByTestId('control')
        .should('have.attr', 'aria-busy', 'true')
        .and('have.attr', 'aria-disabled', 'true')
        .and('have.attr', 'data-loading')
      cy.getByTestId('control').should('be.disabled')
    })
  })

  describe('role-aware non-native controls', () => {
    const roleCases: readonly {
      attributes: Record<string, string>
      role: ControlRole
    }[] = [
      {
        attributes: {
          contenteditable: 'true',
          'aria-multiline': 'true',
        },
        role: 'textbox',
      },
      {
        attributes: {
          contenteditable: 'true',
        },
        role: 'searchbox',
      },
      {
        attributes: {
          'aria-valuemax': '10',
          'aria-valuemin': '0',
          'aria-valuenow': '5',
        },
        role: 'spinbutton',
      },
      {
        attributes: {
          'aria-controls': 'email-options',
          'aria-expanded': 'false',
          'aria-haspopup': 'listbox',
        },
        role: 'combobox',
      },
      {
        attributes: {
          'aria-activedescendant': 'email-option',
        },
        role: 'listbox',
      },
      {
        attributes: {
          'aria-checked': 'false',
        },
        role: 'checkbox',
      },
    ]

    function mountRoleValidityField({
      control,
      errorPolicy,
      role,
    }: {
      control: (args: ControlRenderArgs) => ReactNode
      errorPolicy?: FieldErrorPolicy
      role: ControlRole
    }) {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Choose a valid value.'],
      ])

      cy.mount(
        <FieldRoot
          errorMap={errorMap}
          errorPolicy={errorPolicy}
          label="Email"
          name="email"
        >
          <Control role={role}>{control}</Control>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )
    }

    function expectNativeRoleValidityError(role: ControlRole) {
      cy.getByTestId<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('control').then(($control) => {
        $control.get(0).checkValidity()
      })
      cy.getByTestId('control')
        .should('have.attr', 'role', role)
        .and('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', 'Choose a valid value.')
    }

    roleCases.forEach(({ attributes, role }) => {
      it(`REQ-020 REQ-021 REQ-022 REQ-023 PRD-016 supports ${role} control props`, () => {
        const errorMap = new Map<FieldErrorKey, string>([
          ['customServerError', 'Choose a valid value.'],
        ])

        cy.mount(
          <FieldRoot
            activeErrors={new Set(['customServerError'])}
            description="Used for receipts."
            errorMap={errorMap}
            isLoading
            isReadOnly
            isRequired
            label="Email"
            name="email"
          >
            <Control role={role}>
              {({ controlProps }) => (
                <div
                  data-testid="control"
                  {...attributes}
                  {...controlProps}
                />
              )}
            </Control>
            <Description data-testid="description" />
            <ErrorMessage data-testid="error" />
          </FieldRoot>,
        )

        cy.getByTestId('control')
          .should('have.attr', 'role', role)
          .and('have.attr', 'aria-required', 'true')
          .and('have.attr', 'aria-readonly', 'true')
          .and('have.attr', 'aria-busy', 'true')
          .and('have.attr', 'aria-disabled', 'true')
          .and('have.attr', 'aria-invalid', 'true')
          .and('have.attr', 'data-loading')
        cy.getByTestId('control').should('not.have.attr', 'required')
        cy.getByTestId('control').should('not.have.attr', 'readonly')
        cy.getByTestId('control').should('not.have.attr', 'disabled')
        cy.getByTestId('control').should('not.have.attr', 'name')
        Object.entries(attributes).forEach(([name, value]) => {
          cy.getByTestId('control').should('have.attr', name, value)
        })
        cy.getByTestId('description')
          .invoke('attr', 'id')
          .then((descriptionId) => {
            cy.getByTestId('control').should(
              'have.attr',
              'aria-describedby',
              descriptionId,
            )
          })
        cy.getByTestId('error')
          .invoke('attr', 'id')
          .then((errorId) => {
            cy.getByTestId('control').should(
              'have.attr',
              'aria-errormessage',
              errorId,
            )
          })
      })
    })

    it('REQ-014 REQ-029 PRD-016 keeps textarea validity handlers available for textbox controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <textarea
            data-testid="control"
            required
            {...controlProps}
          />
        ),
        role: 'textbox',
      })

      expectNativeRoleValidityError('textbox')
    })

    it('REQ-014 REQ-029 PRD-016 keeps search input validity handlers available for searchbox controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <input
            data-testid="control"
            required
            type="search"
            {...controlProps}
          />
        ),
        role: 'searchbox',
      })

      expectNativeRoleValidityError('searchbox')
    })

    it('REQ-014 REQ-029 PRD-016 keeps number input validity handlers available for spinbutton controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <input
            data-testid="control"
            required
            type="number"
            {...controlProps}
          />
        ),
        role: 'spinbutton',
      })

      expectNativeRoleValidityError('spinbutton')
    })

    it('REQ-014 REQ-029 PRD-016 keeps select validity handlers available for combobox controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <select
            data-testid="control"
            required
            {...controlProps}
          >
            <option value="">Choose one</option>
            <option value="email">Email</option>
          </select>
        ),
        role: 'combobox',
      })

      expectNativeRoleValidityError('combobox')
    })

    it('REQ-014 REQ-029 PRD-016 keeps listbox select validity handlers available for listbox controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <select
            data-testid="control"
            required
            size={2}
            {...controlProps}
          >
            <option value="">Choose one</option>
            <option value="email">Email</option>
          </select>
        ),
        role: 'listbox',
      })

      expectNativeRoleValidityError('listbox')
    })

    it('REQ-014 REQ-029 PRD-016 keeps checkbox input validity handlers available for checkbox controls', () => {
      mountRoleValidityField({
        control: ({ controlProps }) => (
          <input
            data-testid="control"
            required
            type="checkbox"
            {...controlProps}
          />
        ),
        role: 'checkbox',
      })

      expectNativeRoleValidityError('checkbox')
    })

    it('REQ-030 PRD-016 lets custom controls wrap events with ValidityState', () => {
      let isValid = false

      mountRoleValidityField({
        control: ({ controlProps, withValidity }) => (
          <div
            data-testid="control"
            {...controlProps}
            onInput={(event) =>
              controlProps.onInput?.(
                withValidity(event, {
                  valid: isValid,
                  valueMissing: !isValid,
                }),
              )
            }
          />
        ),
        errorPolicy: () => true,
        role: 'textbox',
      })

      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control')
        .should('have.attr', 'role', 'textbox')
        .and('have.attr', 'aria-invalid', 'true')
      cy.getByTestId('error').should('have.text', 'Choose a valid value.')

      cy.then(() => {
        isValid = true
      })
      cy.getByTestId('control').trigger('input', { force: true })
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('error').find('p').should('have.length', 0)
    })
  })

  describe('controlled errors', () => {
    it('REQ-013 PRD-002 PRD-003 PRD-006 uses activeErrors as the current active error keys', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        ['typeMismatch', 'Enter a valid email address.'],
        ['tooShort', 'Use at least 8 characters.'],
        ['customServerError', 'This email is already registered.'],
      ])
      const activeErrors = new Set<FieldErrorKey>([
        'typeMismatch',
        'customServerError',
      ])

      cy.mount(
        <FieldRoot
          activeErrors={activeErrors}
          errorMap={errorMap}
          label="Email"
          name="email"
        >
          <Control>
            {({ controlProps }) => (
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

  describe('errorPolicy', () => {
    function mountPolicyField({
      activeErrors,
      errorMap,
      errorPolicy,
      label = 'Email',
      name = 'email',
      required = false,
      type = 'text',
    }: {
      activeErrors?: ReadonlySet<FieldErrorKey>
      errorMap: ReadonlyMap<FieldErrorKey, string>
      errorPolicy: FieldErrorPolicy | undefined
      label?: string
      name?: string
      required?: boolean
      type?: string
    }) {
      cy.mount(
        <FieldRoot
          activeErrors={activeErrors}
          errorMap={errorMap}
          errorPolicy={errorPolicy}
          label={label}
          name={name}
        >
          <Control>
            {({ controlProps }) => (
              <input
                data-testid="control"
                required={required}
                type={type}
                {...controlProps}
              />
            )}
          </Control>
          <ErrorMessage data-testid="error" />
        </FieldRoot>,
      )
    }

    function getMessagesForKeys(
      errorMap: ReadonlyMap<FieldErrorKey, string>,
      errorKeys: Iterable<FieldErrorKey>,
    ) {
      return [...errorKeys].flatMap((errorKey) => {
        const message = errorMap.get(errorKey)
        return message ? [message] : []
      })
    }

    function expectErrorMessages(messages: readonly string[]) {
      cy.getByTestId('error')
        .find('p')
        .should('have.length', messages.length)
        .each(($message, index) => {
          cy.wrap($message).should('have.text', messages[index])
        })
    }

    function expectNoErrorMessages() {
      cy.getByTestId('error').find('p').should('have.length', 0)
    }

    function getPolicyCall(errorPolicy: Stub, event: string) {
      return errorPolicy.getCalls().find((call) => call.args[0].event === event)
    }

    function expectPolicyCallState(
      errorPolicy: Stub,
      expectedState: {
        activeErrors?: ReadonlySet<FieldErrorKey>
        event: string
        field?: Partial<{
          wasBlurred: boolean
          wasChanged: boolean
          wasErrored: boolean
          wasTouched: boolean
        }>
        form?: Partial<{ wasSubmitted: boolean }>
        isErrorVisible?: boolean
        isValid?: boolean
        source?: 'event' | 'first' | 'latest'
      },
    ) {
      const source = expectedState.source ?? 'event'
      const args =
        source === 'first'
          ? errorPolicy.firstCall.args[0]
          : source === 'latest'
            ? errorPolicy.lastCall.args[0]
            : getPolicyCall(errorPolicy, expectedState.event)?.args[0]

      expect(args, `${expectedState.event} policy call`).not.to.equal(undefined)
      expect(args.event, `${expectedState.event} event`).to.equal(
        expectedState.event,
      )

      if (expectedState.isValid !== undefined) {
        expect(args.isValid, `${expectedState.event} isValid`).to.equal(
          expectedState.isValid,
        )
      }

      if (expectedState.isErrorVisible !== undefined) {
        expect(
          args.isErrorVisible,
          `${expectedState.event} isErrorVisible`,
        ).to.equal(expectedState.isErrorVisible)
      }

      if (expectedState.activeErrors) {
        expect(
          args.activeErrors,
          `${expectedState.event} activeErrors`,
        ).to.equal(expectedState.activeErrors)
      }

      Object.entries(expectedState.field ?? {}).forEach(([key, value]) => {
        expect(args.field[key], `${expectedState.event} ${key}`).to.equal(value)
      })

      Object.entries(expectedState.form ?? {}).forEach(([key, value]) => {
        expect(args.form[key], `${expectedState.event} form.${key}`).to.equal(
          value,
        )
      })
    }

    it('PRD-007 hides active errors when errorPolicy returns false', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        ['typeMismatch', 'Enter a valid email address.'],
      ])
      const activeErrors = new Set<FieldErrorKey>([
        'valueMissing',
        'typeMismatch',
      ])

      mountPolicyField({
        activeErrors,
        errorMap,
        errorPolicy: () => false,
      })

      expectNoErrorMessages()
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
    })

    it('PRD-007 shows all active errors when errorPolicy returns true', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        ['typeMismatch', 'Enter a valid email address.'],
      ])
      const activeErrors = new Set<FieldErrorKey>([
        'valueMissing',
        'typeMismatch',
      ])
      const expectedMessages = getMessagesForKeys(errorMap, activeErrors)

      mountPolicyField({
        activeErrors,
        errorMap,
        errorPolicy: () => true,
      })

      expectErrorMessages(expectedMessages)
      cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')
    })

    it('PRD-007 shows matching active errors in the order returned by errorPolicy', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        ['typeMismatch', 'Enter a valid email address.'],
      ])
      const activeErrors = new Set<FieldErrorKey>([
        'valueMissing',
        'typeMismatch',
      ])
      const returnedErrors = [
        'typeMismatch',
        'valueMissing',
      ] as const satisfies readonly FieldErrorKey[]
      const expectedMessages = getMessagesForKeys(errorMap, returnedErrors)

      mountPolicyField({
        activeErrors,
        errorMap,
        errorPolicy: () => returnedErrors,
      })

      expectErrorMessages(expectedMessages)
    })

    it('PRD-007 ignores error keys returned by errorPolicy when they are not active', () => {
      const ignoredError = 'customServerError' satisfies FieldErrorKey
      const shownError = 'typeMismatch' satisfies FieldErrorKey
      const returnedErrors = [
        ignoredError,
        shownError,
      ] as const satisfies readonly FieldErrorKey[]
      const activeErrors = new Set<FieldErrorKey>(['valueMissing', shownError])
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        [shownError, 'Enter a valid email address.'],
        [ignoredError, 'This email is already registered.'],
      ])
      const expectedMessages = getMessagesForKeys(
        errorMap,
        returnedErrors.filter((errorKey) => activeErrors.has(errorKey)),
      )
      const ignoredMessage = errorMap.get(ignoredError)

      mountPolicyField({
        activeErrors,
        errorMap,
        errorPolicy: () => returnedErrors,
      })

      expectErrorMessages(expectedMessages)
      cy.getByTestId('error').should('not.contain', ignoredMessage)
    })

    it('PRD-008 PRD-009 PRD-010 PRD-011 passes initial policy state for controlled active errors', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
        ['typeMismatch', 'Enter a valid email address.'],
      ])
      const activeErrors = new Set<FieldErrorKey>([
        'valueMissing',
        'typeMismatch',
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(true)

      mountPolicyField({
        activeErrors,
        errorMap,
        errorPolicy,
      })

      cy.get('@errorPolicy').should('have.been.called')
      cy.then(() => {
        expectPolicyCallState(errorPolicy, {
          activeErrors,
          event: 'invalid',
          field: {
            wasBlurred: false,
            wasChanged: false,
            wasErrored: false,
            wasTouched: false,
          },
          form: {
            wasSubmitted: false,
          },
          isErrorVisible: false,
          isValid: false,
          source: 'first',
        })
      })
    })

    it('PRD-008 PRD-009 PRD-010 passes invalid event policy state for native validation', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(true)

      mountPolicyField({
        errorMap,
        errorPolicy,
        required: true,
      })

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        $control.get(0).checkValidity()
      })
      expectErrorMessages(['Enter an email address.'])
      cy.then(() => {
        expectPolicyCallState(errorPolicy, {
          event: 'invalid',
          field: {
            wasBlurred: false,
            wasChanged: false,
            wasErrored: true,
            wasTouched: true,
          },
          isErrorVisible: true,
          isValid: false,
          source: 'latest',
        })
      })
    })

    it('PRD-008 PRD-009 PRD-010 passes input event policy state after a visible error', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(true)

      mountPolicyField({
        errorMap,
        errorPolicy,
        required: true,
      })

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        $control.get(0).checkValidity()
      })
      expectErrorMessages(['Enter an email address.'])

      cy.getByTestId('control').invoke('val', 'a').trigger('input')
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.then(() => {
        expectPolicyCallState(errorPolicy, {
          event: 'input',
          field: {
            wasBlurred: false,
            wasChanged: true,
            wasErrored: true,
            wasTouched: true,
          },
          isErrorVisible: false,
          isValid: true,
          source: 'latest',
        })
      })
    })

    it('PRD-008 PRD-010 marks the field as blurred after focus leaves the control', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(false)

      mountPolicyField({
        errorMap,
        errorPolicy,
      })

      cy.getByTestId('control').trigger('focusin')
      cy.getByTestId('control').trigger('focusout')
      cy.then(() => {
        expectPolicyCallState(errorPolicy, {
          event: 'blur',
          field: {
            wasBlurred: true,
          },
        })
      })
    })

    it('PRD-008 PRD-010 marks the field as touched when the control receives focus', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(false)

      mountPolicyField({
        errorMap,
        errorPolicy,
      })

      cy.getByTestId('control').focus()
      cy.wrap(null).should(() => {
        expectPolicyCallState(errorPolicy, {
          event: 'focus',
          field: {
            wasTouched: true,
          },
        })
      })
    })

    it('PRD-007 uses the default error policy when no custom errorPolicy is supplied', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Enter an email address.'],
      ])

      mountPolicyField({
        errorMap,
        errorPolicy: undefined,
        required: true,
      })

      cy.getByTestId('control').trigger('input')
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      expectNoErrorMessages()

      cy.getByTestId('control').trigger('focusout')
      expectErrorMessages(['Enter an email address.'])
      cy.getByTestId('control').should('have.attr', 'aria-invalid', 'true')

      cy.getByTestId('control').invoke('val', 'a').trigger('input')
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      expectNoErrorMessages()
    })

    it('PRD-008 PRD-010 passes change event policy state for native checkbox changes', () => {
      const errorMap = new Map<FieldErrorKey, string>([
        ['valueMissing', 'Accept the terms.'],
      ])
      const errorPolicy = cy.stub().as('errorPolicy').returns(true)

      mountPolicyField({
        errorMap,
        errorPolicy,
        label: 'Accept terms',
        name: 'terms',
        required: true,
        type: 'checkbox',
      })

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        $control.get(0).checkValidity()
      })
      expectErrorMessages(['Accept the terms.'])

      cy.getByTestId('control').check()
      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.then(() => {
        expectPolicyCallState(errorPolicy, {
          event: 'change',
          field: {
            wasChanged: true,
            wasTouched: true,
          },
          isErrorVisible: true,
          isValid: true,
        })
      })
    })
  })
})
