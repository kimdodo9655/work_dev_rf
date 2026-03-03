import type { AxiosInstance } from 'axios'

import { runRefreshOnce } from '@/api/interceptors/refresh'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

const MAX_REFRESH_RETRIES = 3

let isRefreshing = false
let refreshRetryCount = 0
let failedQueue: Array<{
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((pending) => {
    if (error) pending.reject(error)
    else pending.resolve(token)
  })
  failedQueue = []
}

const { showApiError } = useApiAlert()
const { findReplacement, replaceText } = useCodeReplacer()

function normalizeApiPayload(payload: unknown, status?: number) {
  if (!payload || typeof payload !== 'object') return

  const target = payload as {
    code?: unknown
    title?: unknown
    message?: unknown
  }

  const category = typeof status === 'number' && status >= 400 ? 'errorCodes' : 'successCodes'
  const byCode = findReplacement(target.code, category)

  if (typeof target.title === 'string') {
    target.title = byCode ?? findReplacement(target.title, category) ?? replaceText(target.title)
  }
  if (typeof target.message === 'string') {
    target.message =
      byCode ?? findReplacement(target.message, category) ?? replaceText(target.message)
  }
}

async function handleAuthFailure() {
  if (typeof window === 'undefined') return
  if (window.location.pathname.startsWith('/auth/')) {
    logger.info('[AUTH] Already on auth page - Skip failure handling')
    return
  }

  storage.clear()
  refreshRetryCount = 0

  await showApiError({
    title: '세션 만료',
    message: '세션이 만료되었습니다. 다시 로그인해주세요.'
  })

  window.location.href = '/auth/login'
}

export function setupResponseInterceptor(api: AxiosInstance) {
  api.interceptors.response.use(
    (response) => {
      normalizeApiPayload(response.data, response.status)

      if (ENV.IS_DEV) {
        logger.debug('[API RESPONSE SUCCESS]', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          data: response.data
        })
      }
      return response
    },
    async (error) => {
      const originalRequest = error.config
      normalizeApiPayload(error?.response?.data, error?.response?.status)

      if (typeof error?.response?.data?.message === 'string') {
        error.message = replaceText(error.response.data.message)
      }

      if (error.response?.status !== 401 || originalRequest._retry) {
        logger.error('[API RESPONSE ERROR]', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.response?.data?.message,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase()
        })
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
        logger.error('[AUTH] Token refresh max retries exceeded', {
          retryCount: refreshRetryCount,
          maxRetries: MAX_REFRESH_RETRIES
        })
        await handleAuthFailure()
        return Promise.reject(error)
      }

      originalRequest._retry = true
      isRefreshing = true
      refreshRetryCount++

      try {
        logger.info('[AUTH] Token refresh attempt', {
          retryCount: refreshRetryCount,
          maxRetries: MAX_REFRESH_RETRIES
        })

        await runRefreshOnce({ ignoreCooldown: true })
        const newAccessToken = storage.getAccessToken()

        processQueue(null, newAccessToken)
        refreshRetryCount = 0
        logger.info('[AUTH] Token refresh success')

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return api(originalRequest)
      } catch (err) {
        logger.error('[AUTH] Token refresh failed', {
          retryCount: refreshRetryCount,
          maxRetries: MAX_REFRESH_RETRIES,
          error: err
        })
        processQueue(err, null)
        await handleAuthFailure()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
  )
}
