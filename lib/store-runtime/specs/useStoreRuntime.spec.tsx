import { expect, test } from '@playwright/experimental-ct-react'
import { StoreRuntimeProbe } from './useStoreRuntime.story'

test('PRD-004 runtime resolves and reuses the same store instance for the same key', async ({
  mount,
  page,
}) => {
  await mount(<StoreRuntimeProbe />)

  await expect(page.getByTestId('same-instance')).toHaveText('true')
  await expect(page.getByTestId('first-value')).toHaveText('0')
  await expect(page.getByTestId('second-value')).toHaveText('0')

  await page.getByRole('button', { name: 'Update first store' }).click()

  await expect(page.getByTestId('first-value')).toHaveText('1')
  await expect(page.getByTestId('second-value')).toHaveText('1')
})
