import {
  NATIVE_DISABLED_CASES,
  mountNativeCheckbox,
} from './booleanControlField'

describe('BooleanControl native mode', () => {
  describe('interaction', () => {
    // Focusing directly lets a disabled checkbox refuse focus, as Tab would.
    const PATHS = [
      {
        activate: () => cy.getByTestId('control').realClick(),
        blockedWhenDisabled: 'REQ-031',
        blockedWhenReadOnly: 'REQ-044',
        path: 'pointer',
        toggles: 'REQ-029',
      },
      {
        activate: () =>
          cy
            .getByTestId('control')
            .then(([control]) => control.focus())
            .realPress('Space'),
        blockedWhenDisabled: 'REQ-032',
        blockedWhenReadOnly: 'REQ-045',
        path: 'keyboard',
        toggles: 'REQ-030',
      },
    ]

    PATHS.forEach(
      ({
        activate,
        blockedWhenDisabled,
        blockedWhenReadOnly,
        path,
        toggles,
      }) => {
        it(`${toggles} toggles an enabled native checkbox by ${path}`, () => {
          mountNativeCheckbox({ control: { onChange: cy.stub().as('change') } })

          activate()

          cy.getByTestId('control').should('have.prop', 'checked', true)
          cy.get('@change').should('have.been.calledOnce')
        })

        NATIVE_DISABLED_CASES.forEach(({ options, state }) => {
          it(`${blockedWhenDisabled} keeps a ${state} native checkbox unchanged by ${path}`, () => {
            mountNativeCheckbox({
              ...options,
              control: {
                ...options.control,
                onChange: cy.stub().as('change'),
                onClick: cy.stub().as('click'),
              },
            })

            activate()

            cy.getByTestId('control').should('have.prop', 'checked', false)
            cy.get('@change').should('not.have.been.called')
            cy.get('@click').should('not.have.been.called')
          })
        })

        it(`${blockedWhenReadOnly} keeps a readonly native checkbox unchanged by ${path}`, () => {
          mountNativeCheckbox({
            control: { onChange: cy.stub().as('change') },
            field: { isReadOnly: true },
          })

          activate()

          cy.getByTestId('control').should('have.prop', 'checked', false)
          cy.get('@change').should('not.have.been.called')
        })
      },
    )
  })
})
