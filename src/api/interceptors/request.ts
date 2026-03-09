/**
 * 문서 경로: `@/src/api/interceptors/request.ts`
 * 문서 제목: API 인터셉터: request
 */

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { runRefreshOnce, shouldSkipAutoRefresh } from '@/api/interceptors/refresh'
import { isPublicApiRequest } from '@/api/publicApiMap'
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
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    const bankCode = storage.getBankCode()
    if (bankCode && config.headers) {
      config.headers['X-Bank-Code'] = bankCode
    }

    const now = Math.floor(Date.now() / 1000)
    const remainingSeconds = authData.accessExpires - now
    const shouldAttemptAutoRefresh =
      remainingSeconds > 0 && remainingSeconds <= AUTO_REFRESH_THRESHOLD_SECONDS

    if (!shouldSkipAutoRefresh(config.url) && bankCode && shouldAttemptAutoRefresh) {
      runRefreshOnce({ ignoreCooldown: false }).catch((err) => {
        logger.warn('[AUTO_REFRESH] Background refresh failed', { error: err })
      })
    }

    return config
  })
}
