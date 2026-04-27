import { describe, expect, test } from 'bun:test'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { Control, Description, ErrorMessage, FieldRoot, Label } from './Field'

describe(FieldRoot, () => {
  test('PRD-005 keeps generated field ids consistent between server render and client hydration', async () => {
    const errorMap = new Map([['valueMissing', 'Enter an email address.']])
    const field = (
      <FieldRoot
        activeErrors={['valueMissing']}
        description="Used for receipts."
        errorMap={errorMap}
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
        <Description data-testid="description" />
        <ErrorMessage data-testid="error" />
      </FieldRoot>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)

    const serverIds = getFieldIds(container)

    hydrateRoot(container, field)

    await Bun.sleep(0)

    expect(getFieldIds(container)).toEqual(serverIds)
  })
})

function getFieldIds(container: HTMLElement) {
  const label = getRequiredElement<HTMLLabelElement>(container, 'label')
  const control = getRequiredElement<HTMLInputElement>(container, 'control')
  const description = getRequiredElement<HTMLDivElement>(
    container,
    'description',
  )
  const error = getRequiredElement<HTMLDivElement>(container, 'error')

  return {
    controlDescribedBy: control.getAttribute('aria-describedby'),
    controlErrorMessage: control.getAttribute('aria-errormessage'),
    controlId: control.id,
    descriptionId: description.id,
    errorId: error.id,
    labelFor: label.htmlFor,
  }
}

function getRequiredElement<TElement extends HTMLElement>(
  container: HTMLElement,
  testId: string,
): TElement {
  const element = container.querySelector(`[data-testid="${testId}"]`)

  if (!element) {
    throw new globalThis.Error(`Missing element with test id "${testId}".`)
  }

  return element as TElement
}
