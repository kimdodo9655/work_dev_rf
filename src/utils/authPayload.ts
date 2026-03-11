/**
 * 문서 경로: `@/src/utils/authPayload.ts`
 * 문서 제목: 유틸리티 모듈: auth-payload
 */

import type { LoginResponse, TokenRefreshResponse } from '../types/index.ts'
import { findApiPayload, toRecord } from './apiPayload.ts'

// 기준: 만료 시간은 양수
function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
}

export function isLoginResponsePayload(value: unknown): value is Required<LoginResponse> {
  const record = toRecord(value)
  if (!record) return false

  return (
    typeof record.accessToken === 'string' &&
    typeof record.refreshToken === 'string' &&
    typeof record.loginId === 'string' &&
    typeof record.userId === 'number' &&
    typeof record.roleLevel === 'number' &&
    isPositiveNumber(record.accessTokenExpiresIn) &&
    isPositiveNumber(record.refreshTokenExpiresIn)
  )
}

export function isTokenRefreshPayload(value: unknown): value is Required<TokenRefreshResponse> {
  const record = toRecord(value)
  if (!record) return false

  return (
    typeof record.accessToken === 'string' &&
    typeof record.refreshToken === 'string' &&
    isPositiveNumber(record.accessTokenExpiresIn) &&
    isPositiveNumber(record.refreshTokenExpiresIn)
  )
}

export function extractLoginResponsePayload(response: unknown) {
  // 범위: axios / data / result 래핑
  return findApiPayload(response, isLoginResponsePayload)
}

export function extractTokenRefreshPayload(response: unknown) {
  return findApiPayload(response, isTokenRefreshPayload)
}
