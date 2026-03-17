/**
 * 문서 경로: `@/src/api/interceptors/request.ts`
 * 문서 제목: API 인터셉터: request
 */

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { API } from '@/api/endpoints'
import { runRefreshOnce, shouldSkipAutoRefresh } from '@/api/interceptors/refresh'
import { isPublicApiRequest } from '@/api/publicApiMap'
import { shouldAttemptProactiveRefresh } from '@/utils/authInterceptorRules'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

const AUTO_REFRESH_THRESHOLD_SECONDS = 5 * 60

export function setupRequestInterceptor(api: AxiosInstance) {
  if (ENV.IS_DEV) {
    api.interceptors.request.use((config) => {
      logger.debug('[API REQUEST]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        params: config.params,
        data: config.data
      })
      return config
    })
  }

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const isPublic = isPublicApiRequest(config.method, config.url)
    logger.debug('[REQ]', { url: config.url, method: config.method, isPublic })

    // 로그인 전에도 호출 가능한 공개 API는 인증 상태 검증 없이 통과시킨다.
    if (isPublic) {
      return config
    }

    const authData = storage.get()
    if (!isValidAuthData(authData)) {
      logger.error('[API] Invalid auth data detected before request', {
        url: config.url,
        method: config.method?.toUpperCase()
      })
      handleInvalidAuthState()
      return Promise.reject(new Error('Invalid auth data'))
    }

    const accessToken = storage.getAccessToken()
    if (accessToken && config.headers) {
      // 요청 시점의 최신 access token을 헤더에 주입한다.
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    const bankCode = storage.getBankCode()
    if (bankCode && config.headers) {
      // 금융기관 컨텍스트가 필요한 API는 헤더 기반으로 현재 선택 지점을 구분한다.
      config.headers['X-Bank-Code'] = bankCode
    }

    const now = Math.floor(Date.now() / 1000)
    const remainingSeconds = authData.accessExpires - now
    const skipUrls = [API.AUTH.LOGIN, API.AUTH.LOGOUT, API.AUTH.REFRESH] as const
    const shouldAttemptAutoRefresh = shouldAttemptProactiveRefresh({
      url: config.url,
      bankCode,
      remainingSeconds,
      thresholdSeconds: AUTO_REFRESH_THRESHOLD_SECONDS,
      skipUrls
    })

    // 만료 직전에는 요청 실패를 기다리지 않고 백그라운드에서 선제 refresh를 시도한다.
    if (shouldAttemptAutoRefresh && !shouldSkipAutoRefresh(config.url)) {
      runRefreshOnce({ ignoreCooldown: false }).catch((err) => {
        logger.warn('[AUTO_REFRESH] Background refresh failed', { error: err })
      })
    }

    return config
  })
}
