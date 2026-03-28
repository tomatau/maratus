import { expect, test } from '@playwright/experimental-ct-react'
import {
  FocusModalityProbe,
  MultipleFocusModalityProbes,
} from './useFocusModality.story'
import {
  expectOneSharedFocusModalityListenerSet,
  installDocumentListenerCountProbe,
} from './sharedRuntimeAssertions'

test('PRD-001 exposes useFocusModality() for reading the current global modality', async ({
  mount,
  page,
}) => {
  await mount(<FocusModalityProbe />)

  await expect(page.locator('#root output')).toHaveText('null')
})

test('REQ-001 keyboard interaction switches the global focus modality to keyboard', async ({
  mount,
  page,
}) => {
  await mount(<FocusModalityProbe />)

  await page.keyboard.press('Tab')

  await expect(page.locator('#root output')).toHaveText('keyboard')
})

test('REQ-002 pointer interaction switches the global focus modality to pointer', async ({
  mount,
  page,
}) => {
  await mount(<FocusModalityProbe />)

  await page.mouse.move(10, 10)
  await page.mouse.down()

  await expect(page.locator('#root output')).toHaveText('pointer')
})

test('NFR-001 multiple consumers attach one shared document listener set per runtime', async ({
  mount,
  page,
}) => {
  await installDocumentListenerCountProbe(page)

  await mount(<MultipleFocusModalityProbes />)

  await expectOneSharedFocusModalityListenerSet(page)
})
