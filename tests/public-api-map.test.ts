/**
 * 문서 경로: `@/tests/public-api-map.test.ts`
 * 문서 제목: 테스트: public-api-map-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { isPublicApiRequest } from '../src/api/publicApiMap.ts'

test('OpenAPI에 표시된 auth API는 공개 API로 판단한다', () => {
  assert.equal(isPublicApiRequest('post', '/api/auth/login'), true)
  assert.equal(isPublicApiRequest('POST', '/api/auth/refresh'), true)
})

test('표시되지 않은 API는 비공개 API로 판단한다', () => {
  assert.equal(isPublicApiRequest('GET', '/api/notifications'), false)
})

test('템플릿 공개 경로는 실제 ID 경로와 매칭된다', () => {
  assert.equal(
    isPublicApiRequest('GET', '/api/organizations/10/branches/20/documents/download'),
    true
  )
  assert.equal(isPublicApiRequest('PATCH', '/api/registry/rpa/user-tasks/abc123/result'), true)
})
