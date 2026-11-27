import type { UseBooleanControlOptions } from '../src'
import type { FieldErrorKey, FieldRootProps } from '@maratus-component/field'
import type { ReactNode } from 'react'
import {
  Description,
  ErrorMessage,
  FieldRoot,
  Label,
} from '@maratus-component/field'
import { BooleanControl } from '../src'

// Shared by the boolean-control specs.

export const FIELD_NAME = 'terms'
const FIELD_LABEL = 'Accept terms'
const FIELD_DESCRIPTION = 'Used for confirmations.'
export const VALUE_MISSING_MESSAGE = 'Accept the terms.'
export const SERVER_ERROR_MESSAGE = 'Choose a valid value.'

const ERROR_MAP = new Map<FieldErrorKey, string>([
  ['customServerError', SERVER_ERROR_MESSAGE],
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

export type BooleanFieldState = Partial<
  Pick<
    FieldRootProps,
    | 'activeErrors'
    | 'description'
    | 'errorPolicy'
    | 'isLoading'
    | 'isReadOnly'
    | 'isRequired'
  >
>

type MountOptions<TOptions> = {
  control: TOptions
  field?: BooleanFieldState
}

function BooleanField(props: {
  children: ReactNode
  field: BooleanFieldState
}) {
  return (
    <FieldRoot
      description={FIELD_DESCRIPTION}
      errorMap={ERROR_MAP}
      label={FIELD_LABEL}
      name={FIELD_NAME}
      {...props.field}
    >
      <Label data-testid="label" />
      {props.children}
      <Description data-testid="description" />
      <ErrorMessage data-testid="error" />
    </FieldRoot>
  )
}

export type NativeMountOptions = Partial<
  MountOptions<UseBooleanControlOptions<'native'>>
>

export const NATIVE_DISABLED_CASES = [
  { options: { control: {}, field: { isLoading: true } }, state: 'loading' },
  { options: { control: { disabled: true }, field: {} }, state: 'disabled' },
] satisfies { options: NativeMountOptions; state: string }[]

export const FOCUSABLE_DISABLED_CASES = NATIVE_DISABLED_CASES.map(
  ({ options, state }) => ({
    options: {
      ...options,
      control: { ...options.control, disabledBehavior: 'focusable' as const },
    },
    state: `focusable ${state}`,
  }),
)

export const CUSTOM_CHECKBOX = {
  checked: false,
  mode: 'custom',
  role: 'checkbox',
} as const

export function mountNativeCheckbox(options: NativeMountOptions = {}) {
  cy.mount(
    <BooleanField field={options.field ?? {}}>
      <BooleanControl {...options.control}>
        {({ booleanControlProps }) => (
          <input
            data-testid="control"
            {...booleanControlProps}
          />
        )}
      </BooleanControl>
    </BooleanField>,
  )
}

export function mountCustomRoot(
  options: MountOptions<UseBooleanControlOptions<'custom'>>,
) {
  cy.mount(
    <BooleanField field={options.field ?? {}}>
      <BooleanControl {...options.control}>
        {({ booleanControlProps }) => (
          <div
            data-testid="control"
            {...booleanControlProps}
          />
        )}
      </BooleanControl>
    </BooleanField>,
  )
}

// A custom root whose consumer reports its own validity on input.
export function mountReportingCustomRoot(getIsValid: () => boolean) {
  cy.mount(
    <BooleanField field={{ errorPolicy: () => true }}>
      <BooleanControl
        checked={false}
        mode="custom"
        role="checkbox"
      >
        {({ booleanControlProps }) => (
          <div
            data-testid="control"
            {...booleanControlProps}
            onInput={(event) =>
              booleanControlProps.onInput(event, {
                valid: getIsValid(),
                valueMissing: !getIsValid(),
              })
            }
          />
        )}
      </BooleanControl>
    </BooleanField>,
  )
}
