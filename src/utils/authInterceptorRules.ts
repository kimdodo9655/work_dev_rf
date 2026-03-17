/**
 * 문서 경로: `@/src/utils/authInterceptorRules.ts`
 * 문서 제목: 유틸리티 모듈: auth-interceptor-rules
 */

export function shouldSkipAuthFailureRedirect(pathname: string | undefined): boolean {
  if (!pathname) return false
  // 로그인/회원가입 화면에서 다시 로그인으로 보내면 알림 중복과 라우팅 루프가 생길 수 있다.
  return pathname.startsWith('/auth/')
}

export function shouldBypassUnauthorizedRetry(options: {
  status?: number
  hasOriginalRequest: boolean
  isRetryRequest: boolean
}): boolean {
  // 401이 아니거나, 재시도할 원본 요청이 없거나, 이미 한 번 재시도한 요청이면 refresh 루프를 막기 위해 그대로 실패시킨다.
  return options.status !== 401 || !options.hasOriginalRequest || options.isRetryRequest
}

export function shouldSkipAutoRefreshRequest(
  url: string | undefined,
  skipUrls: readonly string[]
): boolean {
  if (!url) return true
  // 로그인/로그아웃/refresh 자체 요청은 토큰 갱신의 대상이 아니라서 제외한다.
  return skipUrls.some((skipUrl) => url.includes(skipUrl))
}
