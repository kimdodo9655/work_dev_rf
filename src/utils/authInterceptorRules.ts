/**
 * 문서 경로: `@/src/utils/authInterceptorRules.ts`
 * 문서 제목: 유틸리티 모듈: auth-interceptor-rules
 */

export function shouldSkipAuthFailureRedirect(pathname: string | undefined): boolean {
  if (!pathname) return false
  return pathname.startsWith('/auth/')
}

export function shouldBypassUnauthorizedRetry(options: {
  status?: number
  hasOriginalRequest: boolean
  isRetryRequest: boolean
}): boolean {
  return options.status !== 401 || !options.hasOriginalRequest || options.isRetryRequest
}

export function shouldSkipAutoRefreshRequest(
  url: string | undefined,
  skipUrls: readonly string[]
): boolean {
  if (!url) return true
  return skipUrls.some((skipUrl) => url.includes(skipUrl))
}
