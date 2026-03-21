import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/experimental-ct-react'
import { Button } from '.'

test('REQ-001 REQ-002 PRD-003 button renders native button semantics and has no automatic axe violations', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).toHaveText('Press me')

  const results = await new AxeBuilder({ page }).include('#root').analyze()
  expect(results.violations).toEqual([])
})

test('REQ-001 PRD-003 button defaults type to button', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
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
