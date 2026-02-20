import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatCurrency,
  formatFileSize,
  formatMessage,
  formatNumber,
  formatPercent,
  formatPhone
} from '../src/utils/format.ts'

test('formatMessage replaces template variables', () => {
  assert.equal(formatMessage('전체 {count}건', { count: 12 }), '전체 12건')
})

test('formatNumber and formatCurrency format ko-KR style', () => {
  assert.equal(formatNumber(1234567), '1,234,567')
  assert.equal(formatCurrency(1234567), '1,234,567원')
})

test('formatPhone normalizes 10/11 digit phone numbers', () => {
  assert.equal(formatPhone('01012345678'), '010-1234-5678')
  assert.equal(formatPhone('0212345678'), '021-234-5678')
})

test('formatFileSize formats bytes into human readable units', () => {
  assert.equal(formatFileSize(0), '0 Bytes')
  assert.equal(formatFileSize(1024), '1 KB')
})

test('formatPercent formats decimal to percentage string', () => {
  assert.equal(formatPercent(0.1234), '12%')
  assert.equal(formatPercent(0.1234, 2), '12.34%')
})
