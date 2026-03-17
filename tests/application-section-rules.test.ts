/**
 * 문서 경로: `@/tests/application-section-rules.test.ts`
 * 문서 제목: 테스트: application-section-rules-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getAllowedRegistryMethods,
  getFixedAdminInfoLinkTime
} from '../src/features/registration/composables/applicationSection.rules.ts'

test('말소 계열 등기유형은 상환 은행 의뢰를 허용한다', () => {
  assert.deepEqual(
    getAllowedRegistryMethods({
      registryType: 'MORTGAGE_CANCELLATION',
      registryCause: 'TERMINATION'
    }),
    ['ELECTRONIC', 'E_FORM', 'PAPER', 'BANK_REQUEST']
  )

  assert.deepEqual(
    getAllowedRegistryMethods({
      registryType: 'SURFACE_RIGHT_CANCELLATION',
      registryCause: 'TERMINATION'
    }),
    ['ELECTRONIC', 'E_FORM', 'PAPER', 'BANK_REQUEST']
  )
})

test('일반 등기유형은 상환 은행 의뢰를 허용하지 않는다', () => {
  assert.deepEqual(
    getAllowedRegistryMethods({
      registryType: 'MORTGAGE',
      registryCause: 'ESTABLISHMENT_CONTRACT'
    }),
    ['ELECTRONIC', 'E_FORM', 'PAPER']
  )
})

test('성명/등록번호 변경은 전자등기를 제외하고, 추가 방식은 유지한다', () => {
  assert.deepEqual(
    getAllowedRegistryMethods({
      registryType: 'MORTGAGE_CANCELLATION',
      registryCause: 'NAME_CHANGE'
    }),
    ['E_FORM', 'PAPER', 'BANK_REQUEST']
  )
})

test('Type 04 / Type 07의 소유권이전, 변경, 경정 전자등기는 행정정보 연계시점을 신청서 작성 이후로 고정한다', () => {
  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_04',
      registryType: 'OWNERSHIP_TRANSFER',
      registryMethod: 'ELECTRONIC'
    }),
    'AFTER_SUBMISSION'
  )

  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_07',
      registryType: 'OWNERSHIP_TRANSFER',
      registryMethod: 'ELECTRONIC'
    }),
    'AFTER_SUBMISSION'
  )

  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_04',
      registryType: 'CHANGE',
      registryMethod: 'ELECTRONIC'
    }),
    'AFTER_SUBMISSION'
  )

  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_07',
      registryType: 'CORRECTION',
      registryMethod: 'ELECTRONIC'
    }),
    'AFTER_SUBMISSION'
  )
})

test('행정정보 연계시점 고정은 전자등기인 Type 04 / Type 07의 소유권이전, 변경, 경정 외에는 적용하지 않는다', () => {
  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_04',
      registryType: 'OWNERSHIP_TRANSFER',
      registryMethod: 'E_FORM'
    }),
    null
  )

  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_04',
      registryType: 'MORTGAGE',
      registryMethod: 'ELECTRONIC'
    }),
    null
  )

  assert.equal(
    getFixedAdminInfoLinkTime({
      progressType: 'TYPE_02',
      registryType: 'OWNERSHIP_TRANSFER',
      registryMethod: 'ELECTRONIC'
    }),
    null
  )
})
