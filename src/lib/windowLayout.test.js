import { test } from 'node:test'
import assert from 'node:assert/strict'
import { arrangeWindowPositions, fitWindowPosition } from './windowLayout.js'

test('keeps windows inside the usable desktop', () => {
  assert.deepEqual(fitWindowPosition({ left: 900, top: -30 }, 600, 400, { width: 1280, height: 664 }), { left: 680, top: 0 })
})

test('handles windows larger than the available space', () => {
  assert.deepEqual(fitWindowPosition({ left: 80, top: 100 }, 600, 400, { width: 320, height: 200 }), { left: 0, top: 0 })
})

test('ignores invalid saved coordinates', () => {
  assert.deepEqual(fitWindowPosition({ left: 'invalid', top: Infinity }, 600, 400, { width: 1280, height: 664 }), { left: 0, top: 0 })
})

test('arranges open windows as a bounded cascade', () => {
  const configs = { terminal: { width: 600, height: 400 }, projects: { width: 660, height: 480 }, about: { width: 440, height: 500 } }
  const positions = arrangeWindowPositions(Object.keys(configs), { width: 1280, height: 664 }, configs)
  assert.deepEqual(positions, { terminal: { left: 80, top: 24 }, projects: { left: 120, top: 56 }, about: { left: 160, top: 88 } })
  assert.deepEqual(arrangeWindowPositions([], { width: 1280, height: 664 }, configs), {})
})

test('arranges windows safely on compact desktops', () => {
  const configs = { terminal: { width: 600, height: 400 }, about: { width: 440, height: 500 } }
  assert.deepEqual(arrangeWindowPositions(Object.keys(configs), { width: 320, height: 200 }, configs), { terminal: { left: 0, top: 0 }, about: { left: 0, top: 0 } })
})
