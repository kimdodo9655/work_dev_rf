/**
 * 문서 경로: `@/tests/format.test.ts`
 * 문서 제목: 테스트: format-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  formatCurrency,
  formatDateTimeSeconds,
  formatElectronicPaymentNumber,
  formatFileSize,
  formatHousingBondNumber,
  formatMessage,
  formatNumber,
  formatPercent,
  formatPhone,
  formatPropertyUniqueNumber,
  formatTaxNumber,
  formatWonAmount
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
  assert.equal(formatPhone('0212345678'), '02-1234-5678')
  assert.equal(formatPhone('021234567'), '02-123-4567')
  assert.equal(formatPhone('0311234567'), '031-123-4567')
})

test('업무 식별번호 포맷 유틸은 하이픈 규칙을 적용한다', () => {
  assert.equal(
    formatTaxNumber('12311212345612345611231234561'),
    '123-1-12-123456-123456-1-123-123456-1'
  )
  assert.equal(formatElectronicPaymentNumber('1234511212112345671'), '12345-1-12-12-1-1234567-1')
  assert.equal(formatHousingBondNumber('11091011254429'), '1109-10-1125-4429')
  assert.equal(formatPropertyUniqueNumber('12341234123456'), '1234-1234-123456')
})

test('금액 포맷 유틸은 원 단위 콤마 형식을 적용한다', () => {
  assert.equal(formatWonAmount(508984), '508,984원')
  assert.equal(formatWonAmount('508984'), '508,984원')
})

test('formatFileSize는 바이트를 읽기 쉬운 단위로 변환한다', () => {
  assert.equal(formatFileSize(0), '0 Bytes')
  assert.equal(formatFileSize(1024), '1 KB')
})

test('formatPercent는 소수를 퍼센트 문자열로 변환한다', () => {
  assert.equal(formatPercent(0.1234), '12%')
  assert.equal(formatPercent(0.1234, 2), '12.34%')
})

test('formatDateTimeSeconds는 ISO 날짜/시간 문자열을 초 단위 형식으로 변환한다', () => {
  assert.equal(formatDateTimeSeconds('2026-03-10T17:02:25.124272'), '2026-03-10 17:02:25')
  assert.equal(formatDateTimeSeconds('2025-06-15 11:11:11'), '2025-06-15 11:11:11')
})
