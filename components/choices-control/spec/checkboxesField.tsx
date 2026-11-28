import type { FieldRootProps, ValidityErrorKey } from '@maratus-component/field'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { useState } from 'react'
import { ChoicesControl } from '../src'

// Shared by the checkboxes and checkboxes-validity specs.

export const FIELD_NAME = 'checkboxes-field'
const FIELD_LABEL = 'Checkboxes field'
const FIELD_DESCRIPTION = 'Checkboxes field description.'
export const FIRST_CHOICE = 'first-choice'
export const SECOND_CHOICE = 'second-choice'
export const DISABLED_CHOICE = 'disabled-choice'
export const CONSUMER_NAME = 'consumer-name'
export const VALUE_MISSING_MESSAGE = 'Value missing.'

const ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

export type CheckboxFixture = {
  disabled: boolean
  isRequired: boolean
  name?: string
  value: string
}

export const CHECKBOXES: readonly CheckboxFixture[] = [
  { disabled: false, isRequired: false, value: FIRST_CHOICE },
  { disabled: false, isRequired: false, value: SECOND_CHOICE },
  { disabled: true, isRequired: false, value: DISABLED_CHOICE },
]

export const REQUIRED_FIRST_CHECKBOX: readonly CheckboxFixture[] = [
  { disabled: false, isRequired: true, value: FIRST_CHOICE },
  { disabled: false, isRequired: false, value: SECOND_CHOICE },
]

export const ENABLED_CHOICES = [FIRST_CHOICE, SECOND_CHOICE]

export type CheckboxesFieldState = Pick<
  FieldRootProps,
  'isLoading' | 'isReadOnly' | 'isRequired'
>

export type MountOptions = {
  checkboxes?: readonly CheckboxFixture[]
  fieldState?: CheckboxesFieldState
  initialValues?: readonly string[]
}

function CheckboxesField(props: Required<MountOptions>) {
  const [values, setValues] = useState(props.initialValues)

  return (
    <form data-testid="form">
      <FieldRoot
        description={FIELD_DESCRIPTION}
        errorMap={ERROR_MAP}
        label={FIELD_LABEL}
        name={FIELD_NAME}
        {...props.fieldState}
      >
        <Label data-testid="label" />
        {/* No mode, so the checkboxes specs run the default. */}
        <ChoicesControl
          onChange={(event) => {
            const { checked, value } = event.currentTarget
            setValues((current) =>
              checked
                ? [...current, value]
                : current.filter((item) => item !== value),
            )
          }}
        >
          {({ choicesControlProps, getChoicesInputProps }) => (
            <div
              data-testid="control"
              {...choicesControlProps}
            >
              {props.checkboxes.map((checkbox) => (
                <label key={checkbox.value}>
                  <input
                    data-testid={checkbox.value}
                    {...getChoicesInputProps({
                      checked: values.includes(checkbox.value),
                      disabled: checkbox.disabled,
                      name: checkbox.name,
                      required: checkbox.isRequired,
                      value: checkbox.value,
                    })}
                  />
                  {checkbox.value}
                </label>
              ))}
            </div>
          )}
        </ChoicesControl>
        <Description data-testid="description" />
        <ErrorMessage data-testid="error" />
      </FieldRoot>
    </form>
  )
}

export function mountCheckboxes(options: MountOptions = {}) {
  cy.mount(
    <CheckboxesField
      checkboxes={options.checkboxes ?? CHECKBOXES}
      fieldState={options.fieldState ?? {}}
      initialValues={options.initialValues ?? []}
    />,
  )
}

export function getCheckboxes() {
  return cy.getByTestId('control').find('input')
}
