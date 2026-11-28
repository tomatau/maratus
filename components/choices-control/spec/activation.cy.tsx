import type { FieldRootProps } from '@maratus-component/field'
import { FieldRoot } from '@maratus-component/field'
import { ChoicesControl } from '../src'

const ACTIVATION_KEYS = ['Enter', 'Space'] as const

type ActivationFieldState = Pick<FieldRootProps, 'isLoading' | 'isReadOnly'>

type ActivationMode = 'checkbox-items' | 'listbox'

type ActivationTarget = 'item' | 'root'

const SUPPRESSED_CASES = [
  {
    fieldState: { isLoading: true },
    disabled: false,
    mode: 'checkbox-items',
    target: 'item',
    title: 'PRD-011 GPRD-008 skips item activation handlers while loading',
  },
  {
    fieldState: {},
    disabled: true,
    mode: 'checkbox-items',
    target: 'item',
    title: 'PRD-011 skips activation handlers on a disabled item',
  },
  {
    fieldState: { isLoading: true },
    disabled: false,
    mode: 'checkbox-items',
    target: 'root',
    title: 'PRD-011 GPRD-008 skips root activation handlers while loading',
  },
  {
    fieldState: { isReadOnly: true },
    disabled: false,
    mode: 'checkbox-items',
    target: 'item',
    title:
      'REQ-046 REQ-047 skips activation handlers on a readonly checkbox item',
  },
  {
    fieldState: { isReadOnly: true },
    disabled: false,
    mode: 'checkbox-items',
    target: 'root',
    title:
      'REQ-047 skips root activation handlers on a readonly checkbox group',
  },
  {
    fieldState: { isReadOnly: true },
    disabled: false,
    mode: 'listbox',
    target: 'item',
    title:
      'REQ-048 REQ-049 skips activation handlers on a readonly listbox option',
  },
  {
    fieldState: { isReadOnly: true },
    disabled: false,
    mode: 'listbox',
    target: 'root',
    title: 'REQ-049 skips root activation handlers on a readonly listbox',
  },
] satisfies {
  fieldState: ActivationFieldState
  disabled: boolean
  mode: ActivationMode
  target: ActivationTarget
  title: string
}[]

describe('ChoicesControl activation', () => {
  for (const {
    fieldState,
    disabled,
    mode,
    target,
    title,
  } of SUPPRESSED_CASES) {
    it(title, () => {
      mountActivationField({ fieldState, disabled, mode, target })

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
      disabled: false,
      mode: 'checkbox-items',
      target: 'item',
    })

    cy.getByTestId('item').focus().realPress('ArrowDown')

    cy.get('@keyDown').should('have.been.calledOnce')
  })
})

function mountActivationField(options: {
  fieldState: ActivationFieldState
  disabled: boolean
  mode: ActivationMode
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
        mode={options.mode}
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
                disabled: options.disabled,
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
