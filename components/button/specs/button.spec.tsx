import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/experimental-ct-react'
import { Button } from '../src'

test('REQ-001 REQ-002 PRD-003 button renders native button semantics and has no automatic axe violations', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).toHaveText('Press me')

  const results = await new AxeBuilder({ page }).include('#root').analyze()
  expect(results.violations).toEqual([])
})

test('REQ-013 button forwards an explicit type value', async ({
  mount,
  page,
}) => {
  await mount(<Button type="button">Press me</Button>)
  await expect(page.locator('#root button')).toHaveAttribute('type', 'button')
})

test('REQ-004 REQ-008 PRD-001 button sets loading accessibility state', async ({
  mount,
  page,
}) => {
  await mount(<Button isLoading>Saving</Button>)
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-busy',
    'true',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  await expect(page.locator('#root button')).toBeDisabled()
})

test('REQ-005 REQ-008 button sets pressed accessibility state for toggle buttons', async ({
  mount,
  page,
}) => {
  await mount(
    <Button
      kind="toggle"
      pressed
    >
      Selected
    </Button>,
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-pressed',
    'true',
  )
})

test('REQ-005 button supports mixed pressed state for toggle buttons', async ({
  mount,
  page,
}) => {
  await mount(
    <Button
      kind="toggle"
      pressed="mixed"
    >
      Mixed
    </Button>,
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-pressed',
    'mixed',
  )
})

test('REQ-006 command buttons do not set aria-pressed', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).not.toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.locator('#root button')).not.toHaveAttribute(
    'aria-pressed',
    'false',
  )
  await expect(page.locator('#root button')).not.toHaveAttribute(
    'aria-pressed',
    'mixed',
  )
})

test('REQ-003 REQ-004 PRD-002 button can remain focusable while disabled', async ({
  mount,
  page,
}) => {
  await mount(
    <Button
      disabled
      disabledBehavior="focusable"
    >
      Disabled but focusable
    </Button>,
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  await expect(page.locator('#root button')).not.toHaveAttribute('disabled', '')
})

test('REQ-003 button uses native disabled behaviour by default', async ({
  mount,
  page,
}) => {
  await mount(<Button disabled>Disabled</Button>)
  await expect(page.locator('#root button')).toHaveAttribute('disabled', '')
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  await expect(page.locator('#root button')).toBeDisabled()
})

test('REQ-007 disabled button exposes a distinct disabled appearance hook', async ({
  mount,
  page,
}) => {
  await mount(<Button disabled>Disabled</Button>)
  await expect(page.locator('#root button')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
})

test('REQ-010 native button does not set a redundant explicit button role', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).not.toHaveAttribute(
    'role',
    'button',
  )
})

test('REQ-017 enabled buttons activate through pointer interaction', async ({
  mount,
  page,
}) => {
  let activated = 0

  await mount(
    <Button
      onClick={() => {
        activated += 1
      }}
    >
      Press me
    </Button>,
  )

  await page.locator('#root button').click()
  expect(activated).toBe(1)
})

test('REQ-018 enabled buttons activate through keyboard interaction', async ({
  mount,
  page,
}) => {
  let enterActivated = 0
  let spaceActivated = 0

  await mount(
    <>
      <Button
        onClick={() => {
          enterActivated += 1
        }}
      >
        Enter
      </Button>
      <Button
        onClick={() => {
          spaceActivated += 1
        }}
      >
        Space
      </Button>
    </>,
  )

  await page.getByRole('button', { name: 'Enter' }).focus()
  await page.getByRole('button', { name: 'Enter' }).press('Enter')
  expect(enterActivated).toBe(1)

  await page.getByRole('button', { name: 'Space' }).focus()
  await page.getByRole('button', { name: 'Space' }).press('Space')
  expect(spaceActivated).toBe(1)
})

test('REQ-019 disabled buttons do not activate through pointer interaction', async ({
  mount,
  page,
}) => {
  let activated = 0

  await mount(
    <Button
      disabled
      disabledBehavior="focusable"
      onClick={() => {
        activated += 1
      }}
    >
      Press me
    </Button>,
  )

  await page.locator('#root button').dispatchEvent('click')
  expect(activated).toBe(0)
})

test('REQ-020 disabled buttons do not activate through keyboard interaction', async ({
  mount,
  page,
}) => {
  let activated = 0

  await mount(
    <Button
      disabled
      disabledBehavior="focusable"
      onClick={() => {
        activated += 1
      }}
    >
      Press me
    </Button>,
  )

  await page.locator('#root button').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  expect(activated).toBe(0)
})

test('REQ-021 PRD-004 keyboard focus exposes a focus-visible state hook', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)

  await page.keyboard.press('Tab')

  await expect(page.locator('#root button')).toBeFocused()
  await expect(page.locator('#root button')).toHaveAttribute(
    'data-focus-visible',
    '',
  )
})

test('REQ-022 pointer focus does not expose the focus-visible state hook', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)

  await page.locator('#root button').click()

  await expect(page.locator('#root button')).toBeFocused()
  await expect(page.locator('#root button')).not.toHaveAttribute(
    'data-focus-visible',
    '',
  )
})

test('REQ-021 native button remains compatible with the browser focus-visible pseudo-class', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)

  await page.keyboard.press('Tab')

  const matchesFocusVisible = await page
    .locator('#root button')
    .evaluate((element) => element.matches(':focus-visible'))

  expect(matchesFocusVisible).toBe(true)
})

test('REQ-011 submit buttons allow normal HTML form submission behaviour', async ({
  mount,
  page,
}) => {
  let submitted = false

  await mount(
    <form
      onSubmit={() => {
        submitted = true
      }}
    >
      <Button type="submit">Submit</Button>
    </form>,
  )

  await page.locator('#root button').click()
  expect(submitted).toBe(true)
})

test('REQ-012 reset buttons allow normal HTML form reset behaviour', async ({
  mount,
  page,
}) => {
  let reset = false

  await mount(
    <form
      onReset={() => {
        reset = true
      }}
    >
      <input
        defaultValue="before"
        id="field"
      />
      <Button type="reset">Reset</Button>
    </form>,
  )

  await page.locator('#field').fill('after')
  await page.locator('#root button').click()

  await expect(page.locator('#field')).toHaveValue('before')
  expect(reset).toBe(true)
})

test('REQ-013 buttons without a type use the HTML missing-value default', async ({
  mount,
  page,
}) => {
  let submitted = false

  await mount(
    <form
      onSubmit={() => {
        submitted = true
      }}
    >
      <Button>Submit</Button>
    </form>,
  )

  await page.locator('#root button').click()
  expect(submitted).toBe(true)
})

test('REQ-014 submit buttons support HTML form submission attributes', async ({
  mount,
  page,
}) => {
  await mount(
    <Button
      form="settings-form"
      formAction="/save"
      formEncType="multipart/form-data"
      formMethod="post"
      formNoValidate
      formTarget="_blank"
      type="submit"
    >
      Submit
    </Button>,
  )

  await expect(page.locator('#root button')).toHaveAttribute(
    'form',
    'settings-form',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'formaction',
    '/save',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'formenctype',
    'multipart/form-data',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'formmethod',
    'post',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'formnovalidate',
    '',
  )
  await expect(page.locator('#root button')).toHaveAttribute(
    'formtarget',
    '_blank',
  )
})

test('REQ-015 buttons support HTML form association attributes', async ({
  mount,
  page,
}) => {
  await mount(
    <>
      <form id="linked-form" />
      <Button
        form="linked-form"
        name="intent"
        type="submit"
        value="save"
      >
        Save
      </Button>
    </>,
  )

  await expect(page.locator('#root button')).toHaveAttribute(
    'form',
    'linked-form',
  )
  await expect(page.locator('#root button')).toHaveAttribute('name', 'intent')
  await expect(page.locator('#root button')).toHaveAttribute('value', 'save')

  const submittedValue = await page.locator('#root').evaluate((root) => {
    const form = root.querySelector('form')
    const button = root.querySelector('button')

    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Expected form element')
    }

    if (!(button instanceof HTMLButtonElement)) {
      throw new Error('Expected button element')
    }

    return String(new FormData(form, button).get('intent') ?? '')
  })

  expect(submittedValue).toBe('save')
})
