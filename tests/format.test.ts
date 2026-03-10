/**
 * 문서 경로: `@/tests/format.test.ts`
 * 문서 제목: 테스트: format-test
 */

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

test('formatMessage는 템플릿 변수를 치환한다', () => {
  assert.equal(formatMessage('전체 {count}건', { count: 12 }), '전체 12건')
})

test('formatNumber와 formatCurrency는 ko-KR 형식으로 포맷한다', () => {
  assert.equal(formatNumber(1234567), '1,234,567')
  assert.equal(formatCurrency(1234567), '1,234,567원')
})

test('formatPhone은 10/11자리 전화번호를 정규화한다', () => {
  assert.equal(formatPhone('01012345678'), '010-1234-5678')
  assert.equal(formatPhone('0212345678'), '021-234-5678')
})

test('formatFileSize는 바이트를 읽기 쉬운 단위로 변환한다', () => {
  assert.equal(formatFileSize(0), '0 Bytes')
  assert.equal(formatFileSize(1024), '1 KB')
})

test('formatPercent는 소수를 퍼센트 문자열로 변환한다', () => {
  assert.equal(formatPercent(0.1234), '12%')
  assert.equal(formatPercent(0.1234, 2), '12.34%')
})
