import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/experimental-ct-react'
import { Separator } from '.'

test('separator renders and has no automatic axe violations', async ({
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

test('separator supports decorative mode', async ({ mount, page }) => {
  await mount(<Separator isDecorative />)
  await expect(page.locator('#root hr')).toHaveAttribute('aria-hidden', 'true')
})
