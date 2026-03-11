/**
 * 문서 경로: `@/tests/api-error.test.ts`
 * 문서 제목: 테스트: api-error-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  extractApiErrorDialogContent,
  extractApiErrorMessage,
  extractApiSuccessDialogContent
} from '../src/utils/apiError.ts'

const replaceFns = {
  findReplacement(raw: unknown) {
    if (raw === 'E001') return '치환된 오류'
    if (raw === 'S001') return '치환된 성공'
    return undefined
  },
  replaceText(raw: unknown) {
    return typeof raw === 'string' ? raw : ''
  }
}

test('API 성공 payload에서 다이얼로그 메시지를 추출한다', () => {
  const dialog = extractApiSuccessDialogContent(
    {
      data: {
        result: {
          code: 'S001',
          message: '원본 성공 메시지'
        }
      }
    },
    '성공',
    '기본 성공',
    replaceFns
  )

  assert.deepEqual(dialog, {
    title: '치환된 성공',
    message: '치환된 성공'
  })
})

test('API 에러 응답에서 code/message 우선순위로 다이얼로그를 추출한다', () => {
  const dialog = extractApiErrorDialogContent(
    {
      message: 'axios message',
      response: {
        data: {
          data: {
            code: 'E001',
            message: '원본 오류 메시지'
          }
        }
      }
    },
    '오류',
    '기본 오류',
    replaceFns
  )

  assert.deepEqual(dialog, {
    title: '치환된 오류',
    message: '치환된 오류'
  })
})

test('응답 payload가 없으면 직접 에러 메시지를 fallback으로 사용한다', () => {
  const message = extractApiErrorMessage(
    {
      message: 'network down'
    },
    '기본 오류',
    replaceFns
  )

  assert.equal(message, 'network down')
})
