import { expect, test } from '@playwright/experimental-ct-react'
import { KeyedStoreProbe } from './keyedStore.story'

test('PRD-003 keyed store subscriptions skip unchanged values and scope notifications by key', async ({
  mount,
  page,
}) => {
  await mount(<KeyedStoreProbe />)

  await expect(page.getByTestId('primary-value')).toHaveText('0')
  await expect(page.getByTestId('secondary-value')).toHaveText('0')
  await expect(page.getByTestId('primary-notifications')).toHaveText('0')
  await expect(page.getByTestId('any-notifications')).toHaveText('0')

  await page.getByRole('button', { name: 'Set unchanged primary' }).click()

  await expect(page.getByTestId('primary-notifications')).toHaveText('0')
  await expect(page.getByTestId('any-notifications')).toHaveText('0')

  await page.getByRole('button', { name: 'Set changed secondary' }).click()

  await expect(page.getByTestId('primary-value')).toHaveText('0')
  await expect(page.getByTestId('secondary-value')).toHaveText('1')
  await expect(page.getByTestId('primary-notifications')).toHaveText('0')
  await expect(page.getByTestId('any-notifications')).toHaveText('1')

  await page.getByRole('button', { name: 'Set changed primary' }).click()

  await expect(page.getByTestId('primary-value')).toHaveText('1')
  await expect(page.getByTestId('secondary-value')).toHaveText('1')
  await expect(page.getByTestId('primary-notifications')).toHaveText('1')
  await expect(page.getByTestId('any-notifications')).toHaveText('2')
})
