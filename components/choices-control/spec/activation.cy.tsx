import type { FieldRootProps } from '@maratus-component/field'
import { FieldRoot } from '@maratus-component/field'
import { ChoicesControl } from '../src'

const ACTIVATION_KEYS = ['Enter', 'Space'] as const

type ActivationFieldState = Pick<FieldRootProps, 'isLoading'>

type ActivationTarget = 'item' | 'root'

const SUPPRESSED_CASES = [
  {
    fieldState: { isLoading: true },
    isDisabled: false,
    target: 'item',
    title: 'PRD-011 GPRD-008 skips item activation handlers while loading',
  },
  {
    fieldState: {},
    isDisabled: true,
    target: 'item',
    title: 'PRD-011 skips activation handlers on a disabled item',
  },
  {
    fieldState: { isLoading: true },
    isDisabled: false,
    target: 'root',
    title: 'PRD-011 GPRD-008 skips root activation handlers while loading',
  },
] satisfies {
  fieldState: ActivationFieldState
  isDisabled: boolean
  target: ActivationTarget
  title: string
}[]

describe('ChoicesControl activation', () => {
  for (const { fieldState, isDisabled, target, title } of SUPPRESSED_CASES) {
    it(title, () => {
      mountActivationField({ fieldState, isDisabled, target })

      cy.getByTestId(target).click()
      for (const key of ACTIVATION_KEYS) {
        cy.getByTestId(target).focus().realPress(key)
      }

      cy.get('@activate').should('not.have.been.called')
      cy.get('@keyDown').should('not.have.been.called')
    })
  }

  it('PRD-011 still passes other keys to an item while loading', () => {
    mountActivationField({
      fieldState: { isLoading: true },
      isDisabled: false,
      target: 'item',
    })

    cy.getByTestId('item').focus().realPress('ArrowDown')

    cy.get('@keyDown').should('have.been.calledOnce')
  })
})

function mountActivationField(options: {
  fieldState: ActivationFieldState
  isDisabled: boolean
  target: ActivationTarget
}) {
  const handlers = {
    onClick: cy.stub().as('activate'),
    onKeyDown: cy.stub().as('keyDown'),
  }
  const rootHandlers = options.target === 'root' ? handlers : {}
  const itemHandlers = options.target === 'item' ? handlers : {}

  cy.mount(
    <FieldRoot
      label="Activation field"
      name="activation-field"
      {...options.fieldState}
    >
      <ChoicesControl
        mode="checkbox-items"
        {...rootHandlers}
      >
        {({ choicesControlProps, getChoicesItemProps }) => (
          <div
            data-testid="root"
            tabIndex={0}
            {...choicesControlProps}
          >
            <div
              data-testid="item"
              tabIndex={0}
              {...getChoicesItemProps({
                ...itemHandlers,
                isDisabled: options.isDisabled,
                isSelected: false,
              })}
            >
              Item
            </div>
          </div>
        )}
      </ChoicesControl>
    </FieldRoot>,
  )
}
