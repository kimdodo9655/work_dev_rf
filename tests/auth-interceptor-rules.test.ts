/**
 * 문서 경로: `@/tests/auth-interceptor-rules.test.ts`
 * 문서 제목: 테스트: auth-interceptor-rules-test
 */

import assert from 'node:assert/strict'
import test from 'node:test'

import {
  shouldAttemptProactiveRefresh,
  shouldBypassUnauthorizedRetry,
  shouldHandleAuthFailureRedirect,
  shouldSkipAuthFailureRedirect,
  shouldSkipAutoRefreshRequest
} from '../src/utils/authInterceptorRules.ts'

test('auth 페이지에서는 로그인 리다이렉트를 생략한다', () => {
  assert.equal(shouldSkipAuthFailureRedirect('/auth/login'), true)
  assert.equal(shouldSkipAuthFailureRedirect('/auth/auto-logout'), true)
  assert.equal(shouldSkipAuthFailureRedirect('/dashboard'), false)
  assert.equal(shouldHandleAuthFailureRedirect('/auth/login'), false)
  assert.equal(shouldHandleAuthFailureRedirect('/dashboard'), true)
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

test('선제 refresh는 남은 시간, 금융기관 선택 여부, 제외 URL을 모두 만족할 때만 수행한다', () => {
  const skipUrls = ['/api/auth/login', '/api/auth/logout', '/api/auth/refresh']

  assert.equal(
    shouldAttemptProactiveRefresh({
      url: '/api/registry/progress',
      bankCode: '004',
      remainingSeconds: 120,
      thresholdSeconds: 300,
      skipUrls
    }),
    true
  )

  assert.equal(
    shouldAttemptProactiveRefresh({
      url: '/api/auth/refresh',
      bankCode: '004',
      remainingSeconds: 120,
      thresholdSeconds: 300,
      skipUrls
    }),
    false
  )

  assert.equal(
    shouldAttemptProactiveRefresh({
      url: '/api/registry/progress',
      bankCode: null,
      remainingSeconds: 120,
      thresholdSeconds: 300,
      skipUrls
    }),
    false
  )

  assert.equal(
    shouldAttemptProactiveRefresh({
      url: '/api/registry/progress',
      bankCode: '004',
      remainingSeconds: 600,
      thresholdSeconds: 300,
      skipUrls
    }),
    false
  )
})
