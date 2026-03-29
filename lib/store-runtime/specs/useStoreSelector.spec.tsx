import { expect, test } from '@playwright/experimental-ct-react'
import { StoreSelectorRenderProbe } from './useStoreSelector.story'

test('NFR-002 selector-based consumers do not re-render when an update leaves the selected value unchanged', async ({
  mount,
  page,
}) => {
  await mount(<StoreSelectorRenderProbe />)

  await expect(page.getByTestId('selected')).toHaveText('false')
  await expect(page.getByTestId('render-count')).toHaveText('1')

  await page.getByRole('button', { name: 'Update ignored state' }).click()

  await expect(page.getByTestId('selected')).toHaveText('false')
  await expect(page.getByTestId('render-count')).toHaveText('1')
})
