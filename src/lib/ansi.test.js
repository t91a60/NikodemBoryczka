import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAnsi } from './ansi.js'

function luminance(hex) {
  const channels = hex.match(/[a-f\d]{2}/gi).map(channel => parseInt(channel, 16) / 255)
  return channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0)
}

test('every ANSI text color meets AA on the terminal surface', () => {
  const background = luminance('#0d0810')
  for (const code of [30, 31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97]) {
    const [{ style }] = parseAnsi(`\x1b[${code}mText`)
    const foreground = luminance(style.color)
    const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
    assert(ratio >= 4.5, `ANSI ${code} contrast ${ratio} is below 4.5:1`)
  }
})

test('ANSI reset restores the inherited text color', () => {
  const parts = parseAnsi('\x1b[32mSuccess\x1b[0m normal')
  assert.equal(parts[0].text, 'Success')
  assert.deepEqual(parts[1], { text: ' normal', style: {} })
})
