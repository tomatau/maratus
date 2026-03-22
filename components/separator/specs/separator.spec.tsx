import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/experimental-ct-react'
import { Separator } from '../src'

test('REQ-001 REQ-002 renders with horizontal semantics and has no automatic axe violations', async ({
  mount,
  page,
}) => {
  await mount(<Separator />)
  await expect(page.locator('#root hr')).not.toHaveAttribute(
    'aria-hidden',
    'true',
  )

  const results = await new AxeBuilder({ page }).include('#root').analyze()
  expect(results.violations).toEqual([])
})

test('REQ-003 supports decorative mode', async ({ mount, page }) => {
  await mount(<Separator isDecorative />)
  await expect(page.locator('#root hr')).toHaveAttribute('aria-hidden', 'true')
})

test('REQ-004 does not set separator role on horizontal hr output', async ({
  mount,
  page,
}) => {
  await mount(<Separator />)
  await expect(page.locator('#root hr')).not.toHaveAttribute(
    'role',
    'separator',
  )
})

test('REQ-005 allows presentation roles on horizontal hr output', async ({
  mount,
  page,
}) => {
  await mount(<Separator role="presentation" />)
  await expect(page.locator('#root hr')).toHaveAttribute('role', 'presentation')
})

test('REQ-006 supports vertical orientation', async ({ mount, page }) => {
  await mount(<Separator orientation="vertical" />)
  await expect(page.locator('#root [role="separator"]')).toHaveAttribute(
    'aria-orientation',
    'vertical',
  )
})
