import type { FieldRootProps, ValidityErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { useState } from 'react'
import { ChoicesControl } from '../src'

// Shared by the custom-items, checkbox-items, and listbox specs.

const FIELD_NAME = 'custom-items-field'
const FIELD_LABEL = 'Custom items field'
const FIELD_DESCRIPTION = 'Custom items field description.'
export const FIRST_ITEM = 'first-item'
export const SECOND_ITEM = 'second-item'
export const DISABLED_ITEM = 'disabled-item'
export const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

export const ITEMS = [
  { isDisabled: false, value: FIRST_ITEM },
  { isDisabled: false, value: SECOND_ITEM },
  { isDisabled: true, value: DISABLED_ITEM },
]

export const ENABLED_ITEMS = [FIRST_ITEM, SECOND_ITEM]

export type CustomItemsMode = 'checkbox-items' | 'listbox'

export type CustomItemsFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

function CustomItemsField(props: {
  fieldState: CustomItemsFieldState
  initialValues: readonly string[]
  mode: CustomItemsMode
}) {
  const [values, setValues] = useState(props.initialValues)
  const isRequired = Boolean(props.fieldState.isRequired)

  return (
    <FieldRoot
      description={FIELD_DESCRIPTION}
      errorMap={ERROR_MAP}
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...props.fieldState}
    >
      <Label data-testid="label" />
      <ChoicesControl mode={props.mode}>
        {({ choicesControlProps, getChoicesItemProps }) => (
          <div
            data-testid="control"
            {...choicesControlProps}
            onBlur={(event) =>
              choicesControlProps.onBlur(event, {
                valueMissing: isRequired && values.length === 0,
              })
            }
          >
            {ITEMS.map((item) => (
              <div
                data-testid={item.value}
                key={item.value}
                tabIndex={0}
                {...getChoicesItemProps({
                  isDisabled: item.isDisabled,
                  isSelected: values.includes(item.value),
                })}
                onClick={(event) => {
                  const nextValues = toggleValue(values, item.value)
                  setValues(nextValues)
                  choicesControlProps.onInput(event, {
                    valueMissing: isRequired && nextValues.length === 0,
                  })
                }}
              >
                {item.value}
              </div>
            ))}
          </div>
        )}
      </ChoicesControl>
      <Description data-testid="description" />
      <ErrorMessage data-testid="error" />
    </FieldRoot>
  )
}

function toggleValue(values: readonly string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export function mountCustomItems(options: {
  fieldState?: CustomItemsFieldState
  initialValues?: readonly string[]
  mode: CustomItemsMode
}) {
  cy.mount(
    <CustomItemsField
      fieldState={options.fieldState ?? {}}
      initialValues={options.initialValues ?? []}
      mode={options.mode}
    />,
  )
}

export function reportValueMissing(mode: CustomItemsMode) {
  mountCustomItems({ fieldState: { isRequired: true }, mode })
  cy.getByTestId(FIRST_ITEM).focus()
  cy.getByTestId(FIRST_ITEM).blur()
}

export function getItems() {
  return cy.getByTestId('control').find('[data-testid]')
}
