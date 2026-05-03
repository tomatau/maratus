import { expect } from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'
import { JSDOM } from 'jsdom'

const { window } = new JSDOM('<!doctype html><html><body></body></html>')

expect.extend(matchers)

Object.assign(globalThis, {
  document: window.document,
  window,
})

if (!globalThis.navigator) {
  Object.assign(globalThis, {
    navigator: window.navigator,
  })
}
