import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/experimental-ct-react'
import { Button } from '../src'

test('button renders and has no automatic axe violations', async ({
  mount,
  page,
}) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).toHaveText('Press me')

  const results = await new AxeBuilder({ page }).include('#root').analyze()
  expect(results.violations).toEqual([])
})

test('button defaults type to button', async ({ mount, page }) => {
  await mount(<Button>Press me</Button>)
  await expect(page.locator('#root button')).toHaveAttribute('type', 'button')
})

test('button sets loading accessibility state', async ({ mount, page }) => {
  await mount(<Button isLoading>Saving</Button>)
  await expect(page.locator('#root button')).toHaveAttribute('aria-busy', 'true')
  await expect(page.locator('#root button')).toBeDisabled()
})

test('button sets pressed accessibility state', async ({ mount, page }) => {
  await mount(<Button isPressed>Selected</Button>)
  await expect(page.locator('#root button')).toHaveAttribute('aria-pressed', 'true')
})
