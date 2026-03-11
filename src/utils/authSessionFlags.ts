/**
 * 문서 경로: `@/src/utils/authSessionFlags.ts`
 * 문서 제목: 유틸리티 모듈: auth-session-flags
 */

import { browserStorage } from './browser.ts'

const MANUAL_LOGOUT_FLAG_KEY = 'manualLogoutInProgress'
const AUTO_LOGOUT_PAGE_FLAG_KEY = 'autoLogoutPageAccess'

// 역할: 수동 로그아웃 / 만료 로그아웃 구분
export function markManualLogoutInProgress() {
  browserStorage.setItem('session', MANUAL_LOGOUT_FLAG_KEY, '1')
}

export function clearManualLogoutInProgress() {
  browserStorage.removeItem('session', MANUAL_LOGOUT_FLAG_KEY)
}

export function isManualLogoutInProgress() {
  return browserStorage.getItem('session', MANUAL_LOGOUT_FLAG_KEY) === '1'
}

export function markAutoLogoutPageAccess() {
  // 용도: auto-logout 페이지 1회성 진입 허용
  browserStorage.setItem('session', AUTO_LOGOUT_PAGE_FLAG_KEY, '1')
}

export function consumeAutoLogoutPageAccess() {
  // 규칙: 읽으면 즉시 제거
  const hasAccess = browserStorage.getItem('session', AUTO_LOGOUT_PAGE_FLAG_KEY) === '1'
  if (hasAccess) {
    browserStorage.removeItem('session', AUTO_LOGOUT_PAGE_FLAG_KEY)
  }

  return hasAccess
}
