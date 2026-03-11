/**
 * 문서 경로: `@/tests/auth-interceptor-rules.test.ts`
 * 문서 제목: 테스트: auth-interceptor-rules-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  shouldBypassUnauthorizedRetry,
  shouldSkipAuthFailureRedirect,
  shouldSkipAutoRefreshRequest
} from '../src/utils/authInterceptorRules.ts'

test('auth 페이지에서는 로그인 리다이렉트를 생략한다', () => {
  assert.equal(shouldSkipAuthFailureRedirect('/auth/login'), true)
  assert.equal(shouldSkipAuthFailureRedirect('/auth/auto-logout'), true)
  assert.equal(shouldSkipAuthFailureRedirect('/dashboard'), false)
})

test('401 재시도는 원요청이 있고 아직 재시도 전일 때만 허용한다', () => {
  assert.equal(
    shouldBypassUnauthorizedRetry({
      status: 401,
      hasOriginalRequest: true,
      isRetryRequest: false
    }),
    false
  )

  assert.equal(
    shouldBypassUnauthorizedRetry({
      status: 500,
      hasOriginalRequest: true,
      isRetryRequest: false
    }),
    true
  )

  assert.equal(
    shouldBypassUnauthorizedRetry({
      status: 401,
      hasOriginalRequest: false,
      isRetryRequest: false
    }),
    true
  )

  assert.equal(
    shouldBypassUnauthorizedRetry({
      status: 401,
      hasOriginalRequest: true,
      isRetryRequest: true
    }),
    true
  )
})

test('로그인/로그아웃/리프레시 요청은 auto refresh 대상에서 제외한다', () => {
  const skipUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/refresh']

  assert.equal(shouldSkipAutoRefreshRequest(undefined, skipUrls), true)
  assert.equal(shouldSkipAutoRefreshRequest('/api/auth/login', skipUrls), true)
  assert.equal(shouldSkipAutoRefreshRequest('/api/auth/refresh?foo=1', skipUrls), true)
  assert.equal(shouldSkipAutoRefreshRequest('/api/registry/progress', skipUrls), false)
})
