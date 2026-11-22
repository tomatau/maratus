import type { FieldRootProps } from '../src'
import { mergeRefs } from '@maratus-lib/props'
import {
  Description,
  ErrorMessage,
  FieldControl,
  FieldRoot,
  Label,
} from '../src'
import {
  FIELD_DESCRIPTION,
  FIELD_LABEL,
  FIELD_NAME,
  InputControl,
  VALUE_MISSING_ERROR_MAP,
  VALUE_MISSING_ERRORS,
  commonRootProps,
} from './fieldHarness'

type ControlFieldState = Pick<
  FieldRootProps,
  'activeErrors' | 'isLoading' | 'isReadOnly' | 'isRequired'
>

const STATE_CASES = [
  {
    attributes: [['aria-required', 'true']],
    fieldState: { isRequired: true },
    title: 'REQ-016 PRD-015 exposes required state with aria-required',
  },
  {
    attributes: [['aria-readonly', 'true']],
    fieldState: { isReadOnly: true },
    title: 'REQ-017 PRD-015 exposes readonly state with aria-readonly',
  },
  {
    attributes: [
      ['aria-busy', 'true'],
      ['aria-disabled', 'true'],
      ['data-loading', ''],
    ],
    fieldState: { isLoading: true },
    title: 'REQ-031 PRD-019 marks a loading control busy and disabled',
  },
] satisfies {
  attributes: [string, string][]
  fieldState: ControlFieldState
  title: string
}[]

describe('FieldControl', () => {
  describe('relationships', () => {
    it('REQ-003 exposes the id the label points at', () => {
      mountControl()

      cy.getByTestId('control').should(($control) => {
        expect($control.attr('id')).to.be.a('string').and.not.equal('')
      })
      cy.getByTestId('label').assertReferences('for', ['control'])
    })

    it('REQ-006 references the description with aria-describedby', () => {
      mountControl()

      cy.getByTestId('control').assertReferences('aria-describedby', [
        'description',
      ])
    })

    it('REQ-008 REQ-009 marks a visible error and references it', () => {
      mountControl({ activeErrors: VALUE_MISSING_ERRORS })

      cy.getByTestId('control')
        .should('have.attr', 'aria-invalid', 'true')
        .assertReferences('aria-errormessage', ['error'])
    })

    it('REQ-010 omits aria-invalid and aria-errormessage without visible errors', () => {
      mountControl()

      cy.getByTestId('control').should('not.have.attr', 'aria-invalid')
      cy.getByTestId('control').should('not.have.attr', 'aria-errormessage')
    })
  })

  describe('field state', () => {
    for (const { attributes, fieldState, title } of STATE_CASES) {
      it(title, () => {
        mountControl(fieldState)

        for (const [attribute, value] of attributes) {
          cy.getByTestId('control').should('have.attr', attribute, value)
        }
      })
    }
  })

  describe('rendering customisation', () => {
    it('GPRD-005 applies default and consumer class names to the control', () => {
      cy.mount(
        <FieldRoot
          label={FIELD_LABEL}
          name={FIELD_NAME}
        >
          <InputControl className="custom-control" />
        </FieldRoot>,
      )

      cy.getByTestId('control')
        .should('have.attr', 'class')
        .and('contain', 'fieldControl')
        .and('contain', 'custom-control')
    })

    it('GPRD-005 supports common root props on FieldControl render props', () => {
      cy.mount(
        <FieldRoot
          controlId={commonRootProps.id}
          label={FIELD_LABEL}
          name={FIELD_NAME}
        >
          <FieldControl {...createCommonRootProps(commonRootProps)}>
            {({ fieldControlProps, validityHandlerProps }) => (
              <input
                {...fieldControlProps}
                {...validityHandlerProps}
                ref={mergeRefs(fieldControlProps.ref, validityHandlerProps.ref)}
              />
            )}
          </FieldControl>
        </FieldRoot>,
      )

      cy.get('[data-common-root-prop="supported"]').assertSupportsProps(
        commonRootProps,
      )
    })

    it('REQ-012 preserves native form control attributes and constraint validation behaviour', () => {
      cy.mount(
        <FieldRoot
          label="Age"
          name="age"
        >
          <InputControl
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
          />
        </FieldRoot>,
      )

      cy.getByTestId<HTMLInputElement>('control').then(($control) => {
        const control = $control.get(0)

        expect(control, 'native input element').to.be.instanceOf(
          HTMLInputElement,
        )
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
  })
})

function mountControl(fieldState: ControlFieldState = {}) {
  cy.mount(
    <FieldRoot
      description={FIELD_DESCRIPTION}
      errorMap={VALUE_MISSING_ERROR_MAP}
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...fieldState}
    >
      <Label data-testid="label" />
      <InputControl />
      <Description data-testid="description" />
      <ErrorMessage data-testid="error" />
    </FieldRoot>,
  )
}
