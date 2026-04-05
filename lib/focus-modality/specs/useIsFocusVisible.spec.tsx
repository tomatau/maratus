import { expect, test } from '@playwright/experimental-ct-react'
import {
  expectOneSharedFocusModalityListenerSet,
  installDocumentListenerCountProbe,
} from './sharedRuntimeAssertions'
import {
  FocusVisibleProbe,
  MultipleFocusVisibleProbes,
} from './useIsFocusVisible.story'

test('PRD-002 exposes useIsFocusVisible() for reading the current global focus-visible state', async ({
  mount,
  page,
}) => {
  await mount(<FocusVisibleProbe />)

  await expect(page.locator('#root output')).toHaveText('false')
})

test('REQ-003 PRD-003 keyboard modality makes global focus-visible state true', async ({
  mount,
  page,
}) => {
  await mount(<FocusVisibleProbe />)

  await page.keyboard.press('Tab')

  await expect(page.locator('#root output')).toHaveText('true')
})

test('REQ-004 pointer modality makes global focus-visible state false', async ({
  mount,
  page,
}) => {
  await mount(<FocusVisibleProbe />)

  await page.keyboard.press('Tab')
  await expect(page.locator('#root output')).toHaveText('true')

  await page.mouse.move(10, 10)
  await page.mouse.down()

  await expect(page.locator('#root output')).toHaveText('false')
})

test('NFR-001 multiple focus-visible consumers attach one shared document listener set per runtime', async ({
  mount,
  page,
}) => {
  await installDocumentListenerCountProbe(page)

  await mount(<MultipleFocusVisibleProbes />)

  await expectOneSharedFocusModalityListenerSet(page)
})
