import { expect, test } from '@playwright/experimental-ct-react'
import { FocusModalityProbe } from './useFocusModality.story'

test('PRD-001 exposes useFocusModality() as the low-level shared hook for reading the current global modality', async ({
  mount,
  page,
}) => {
  await mount(<FocusModalityProbe />)

  await expect(page.locator('#root output')).toHaveText('null')
})
