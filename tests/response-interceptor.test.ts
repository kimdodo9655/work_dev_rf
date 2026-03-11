/**
 * 문서 경로: `@/tests/response-interceptor.test.ts`
 * 문서 제목: 테스트: response-interceptor-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import { createResponseInterceptorHandlers } from '../src/utils/responseInterceptor.ts'

function createLoggerMock() {
  return {
    debug() {},
    info() {},
    error() {}
  }
}

test('401 응답에서 refresh 성공 시 원요청을 새 토큰으로 재시도한다', async () => {
  let refreshCalledWith: { ignoreCooldown?: boolean } | null = null
  let retriedRequest: Record<string, unknown> | null = null

  const handlers = createResponseInterceptorHandlers({
    async runRefreshOnce(options) {
      refreshCalledWith = options
    },
    async showApiError() {
      throw new Error('should not be called')
    },
    findReplacement() {
      return undefined
    },
    replaceText(raw) {
      return typeof raw === 'string' ? raw : ''
    },
    storage: {
      clear() {},
      getAccessToken() {
        return 'new-access-token'
      }
    },
    browserLocation: {
      getPathname() {
        return '/dashboard'
      },
      assign() {
        throw new Error('should not redirect')
      }
    },
    logger: createLoggerMock(),
    isDev: false
  })

  const originalRequest = {
    url: '/api/protected',
    method: 'get',
    headers: {}
  }

  const result = await handlers.onRejected(
    {
      message: 'Unauthorized',
      config: originalRequest,
      response: {
        status: 401,
        data: {
          message: 'Unauthorized'
        }
      }
    },
    async (request) => {
      retriedRequest = request
      return { ok: true, request }
    }
  )

  assert.deepEqual(refreshCalledWith, { ignoreCooldown: true })
  assert.equal(originalRequest._retry, true)
  assert.equal(originalRequest.headers.Authorization, 'Bearer new-access-token')
  assert.equal(retriedRequest, originalRequest)
  assert.deepEqual(result, { ok: true, request: originalRequest })
})

test('refresh 실패 시 세션을 정리하고 로그인 페이지로 이동시킨다', async () => {
  let cleared = false
  let redirectedTo = ''
  let alertCount = 0

  const handlers = createResponseInterceptorHandlers({
    async runRefreshOnce() {
      throw new Error('refresh failed')
    },
    async showApiError() {
      alertCount += 1
    },
    findReplacement() {
      return undefined
    },
    replaceText(raw) {
      return typeof raw === 'string' ? raw : ''
    },
    storage: {
      clear() {
        cleared = true
      },
      getAccessToken() {
        return null
      }
    },
    browserLocation: {
      getPathname() {
        return '/dashboard'
      },
      assign(url) {
        redirectedTo = url
      }
    },
    logger: createLoggerMock(),
    isDev: false
  })

  await assert.rejects(
    handlers.onRejected(
      {
        message: 'Unauthorized',
        config: {
          url: '/api/protected',
          method: 'get',
          headers: {}
        },
        response: {
          status: 401,
          data: {
            message: 'Unauthorized'
          }
        }
      },
      async () => ({ ok: true })
    ),
    /refresh failed/
  )

  assert.equal(cleared, true)
  assert.equal(alertCount, 1)
  assert.equal(redirectedTo, '/auth/login')
})

test('auth 페이지에서는 refresh 실패 후에도 로그인 리다이렉트를 생략한다', async () => {
  let cleared = false
  let redirected = false
  let alertCount = 0

  const handlers = createResponseInterceptorHandlers({
    async runRefreshOnce() {
      throw new Error('refresh failed')
    },
    async showApiError() {
      alertCount += 1
    },
    findReplacement() {
      return undefined
    },
    replaceText(raw) {
      return typeof raw === 'string' ? raw : ''
    },
    storage: {
      clear() {
        cleared = true
      },
      getAccessToken() {
        return null
      }
    },
    browserLocation: {
      getPathname() {
        return '/auth/login'
      },
      assign() {
        redirected = true
      }
    },
    logger: createLoggerMock(),
    isDev: false
  })

  await assert.rejects(
    handlers.onRejected(
      {
        message: 'Unauthorized',
        config: {
          url: '/api/protected',
          method: 'get',
          headers: {}
        },
        response: {
          status: 401,
          data: {
            message: 'Unauthorized'
          }
        }
      },
      async () => ({ ok: true })
    ),
    /refresh failed/
  )

  assert.equal(cleared, false)
  assert.equal(alertCount, 0)
  assert.equal(redirected, false)
})
