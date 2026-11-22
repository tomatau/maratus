import type {
  FieldErrorKey,
  FieldErrorPolicy,
  FieldRootProps,
  ValidityErrorKey,
} from '../src'
import type { InputHTMLAttributes } from 'react'
import { ErrorMessage, FieldControl, FieldRoot } from '../src'

// Shared by the field specs, one per surface.

export const FIELD_LABEL = 'Email'
export const FIELD_NAME = 'email'
export const FIELD_DESCRIPTION = 'Used for receipts.'
export const VALUE_MISSING_MESSAGE = 'Value missing.'

export const VALUE_MISSING_ERROR_MAP = new Map<ValidityErrorKey, string>([
  ['valueMissing', VALUE_MISSING_MESSAGE],
])

export const VALUE_MISSING_ERRORS = new Set<FieldErrorKey>(['valueMissing'])

export const commonRootProps = COMMON_ROOT_PROPS

export const relationshipRootProps = RELATIONSHIP_ROOT_PROPS

export type InputControlProps = InputHTMLAttributes<HTMLInputElement> & {
  'data-testid'?: string
}

// className is a FieldControl option, so it goes to the hook, not the input.
export function InputControl(props: InputControlProps) {
  const { className, ...inputProps } = props

  return (
    <FieldControl className={className}>
      {({ fieldControlProps, validityHandlerProps }) => (
        <input
          data-testid="control"
          {...inputProps}
          {...fieldControlProps}
          {...validityHandlerProps}
        />
      )}
    </FieldControl>
  )
}

export function mountPolicyField(options: {
  activeErrors?: FieldRootProps['activeErrors']
  errorMap: ReadonlyMap<FieldErrorKey, string>
  errorPolicy: FieldErrorPolicy | undefined
  input?: InputControlProps
}) {
  cy.mount(
    <FieldRoot
      activeErrors={options.activeErrors}
      errorMap={options.errorMap}
      errorPolicy={options.errorPolicy}
      label={FIELD_LABEL}
      name={FIELD_NAME}
    >
      <InputControl {...options.input} />
      <ErrorMessage data-testid="error" />
    </FieldRoot>,
  )
}

export function expectErrorMessages(messages: readonly string[]) {
  cy.getByTestId('error')
    .find('p')
    .should('have.length', messages.length)
    .each(($message, index) => {
      cy.wrap($message).should('have.text', messages[index])
    })
}
