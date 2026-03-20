import { JSDOM } from 'jsdom'

const { window } = new JSDOM('<!doctype html><html><body></body></html>')

Object.assign(globalThis, {
  document: window.document,
  navigator: window.navigator,
  window,
})
