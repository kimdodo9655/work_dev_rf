/**
 * 문서 경로: `@/tests/api-payload.test.ts`
 * 문서 제목: 테스트: api-payload-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  extractArrayByKeys,
  extractPrimaryPayload,
  extractRecordByKeys,
  findApiPayload,
  getApiPayloadCandidates
} from '../src/utils/apiPayload.ts'
import {
  extractLoginResponsePayload,
  extractTokenRefreshPayload
} from '../src/utils/authPayload.ts'

test('중첩된 axios 응답에서 로그인 payload를 추출한다', () => {
  const response = {
    data: {
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresIn: 1700000100,
        refreshTokenExpiresIn: 1700000200,
        loginId: 'tester',
        userId: 7,
        roleLevel: 10
      }
    }
  }

  assert.deepEqual(extractLoginResponsePayload(response), response.data.data)
})

test('result 래퍼 응답에서 refresh payload를 추출한다', () => {
  const response = {
    data: {
      result: {
        accessToken: 'next-access-token',
        refreshToken: 'next-refresh-token',
        accessTokenExpiresIn: 1700000300,
        refreshTokenExpiresIn: 1700000400
      }
    }
  }

  assert.deepEqual(extractTokenRefreshPayload(response), response.data.result)
})

test('payload 탐색은 data/result 경로를 모두 후보에 포함한다', () => {
  const response = {
    data: {
      result: {
        message: '완료'
      }
    }
  }

  const candidates = getApiPayloadCandidates(response)
  assert.equal(candidates.includes(response), true)
  assert.equal(candidates.includes(response.data), true)
  assert.equal(candidates.includes(response.data.result), true)

  const payload = findApiPayload(
    response,
    (candidate): candidate is { message: string } =>
      typeof candidate === 'object' &&
      candidate !== null &&
      'message' in candidate &&
      typeof candidate.message === 'string'
  )
  assert.deepEqual(payload, response.data.result)
})

test('유효하지 않은 인증 응답은 추출하지 않는다', () => {
  const invalidResponse = {
    data: {
      data: {
        accessToken: 'token-only'
      }
    }
  }

  assert.equal(extractLoginResponsePayload(invalidResponse), undefined)
  assert.equal(extractTokenRefreshPayload(invalidResponse), undefined)
})

test('배열 추출 유틸은 래핑된 content/items/banks 배열을 찾는다', () => {
  const wrappedBanks = {
    data: {
      result: {
        banks: [{ code: '001', name: '테스트은행' }]
      }
    }
  }
  const wrappedContent = {
    data: {
      data: {
        content: [{ id: 1 }]
      }
    }
  }
  const directItems = {
    items: ['a', 'b']
  }

  assert.deepEqual(extractArrayByKeys(wrappedBanks, ['banks']), [
    { code: '001', name: '테스트은행' }
  ])
  assert.deepEqual(extractArrayByKeys(wrappedContent, ['content']), [{ id: 1 }])
  assert.deepEqual(extractArrayByKeys(directItems, ['items']), ['a', 'b'])
})

test('배열 추출 유틸은 도메인별 커스텀 키도 찾는다', () => {
  const response = {
    data: {
      data: {
        applicationAdminInfoRequest: [{ adminInfoRequestId: 11 }]
      }
    }
  }

  assert.deepEqual(extractArrayByKeys(response, ['applicationAdminInfoRequest']), [
    { adminInfoRequestId: 11 }
  ])
})

test('레코드 추출 유틸은 필요한 키를 가진 payload를 찾는다', () => {
  const response = {
    data: {
      result: {
        content: [{ id: 1 }],
        totalElements: 5
      }
    }
  }

  assert.deepEqual(extractRecordByKeys(response, ['content']), response.data.result)
})

test('primary payload 추출은 가장 안쪽 data/result payload를 반환한다', () => {
  const response = {
    data: {
      result: {
        data: {
          value: 123
        }
      }
    }
  }

  assert.deepEqual(extractPrimaryPayload(response), { value: 123 })
})
