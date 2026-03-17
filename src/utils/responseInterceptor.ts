/**
 * 문서 경로: `@/src/utils/responseInterceptor.ts`
 * 문서 제목: 유틸리티 모듈: response-interceptor
 */

import { getApiPayloadCandidates, toRecord } from './apiPayload.ts'
import {
  shouldBypassUnauthorizedRetry,
  shouldSkipAuthFailureRedirect
} from './authInterceptorRules.ts'

type RetryRequest = (request: Record<string, unknown>) => Promise<unknown>

type LoggerLike = {
  debug(message: string, meta?: unknown): void
  info(message: string, meta?: unknown): void
  error(message: string, meta?: unknown): void
}

type BrowserLocationLike = {
  getPathname(): string
  assign(url: string): void
}

type StorageLike = {
  clear(): void
  getAccessToken(): string | null
}

type ResponseInterceptorDeps = {
  runRefreshOnce(options: { ignoreCooldown?: boolean }): Promise<void>
  showApiError(options: { title: string; message: string }): Promise<unknown>
  findReplacement(raw: unknown, category?: string): string | undefined
  replaceText(raw: unknown, category?: string): string
  storage: StorageLike
  browserLocation: BrowserLocationLike
  logger: LoggerLike
  isDev: boolean
  maxRefreshRetries?: number
}

type PendingQueueItem = {
  resolve(token: string | null): void
  reject(error: unknown): void
}

type InterceptorResponse = {
  data: unknown
  status?: number
  config?: {
    url?: unknown
    method?: unknown
  }
}

function normalizeApiPayload(
  payload: unknown,
  status: number | undefined,
  deps: Pick<ResponseInterceptorDeps, 'findReplacement' | 'replaceText'>
) {
  // 역할: code/title/message 공통 치환
  const category = typeof status === 'number' && status >= 400 ? 'errorCodes' : 'successCodes'

  for (const candidate of getApiPayloadCandidates(payload)) {
    const target = toRecord(candidate) as {
      code?: unknown
      title?: unknown
      message?: unknown
    } | null
    if (!target) continue

    // code 치환 결과가 있으면 title/message보다 우선 적용해 서버 문구 편차를 줄인다.
    const byCode = deps.findReplacement(target.code, category)

    if (typeof target.title === 'string') {
      target.title =
        byCode ?? deps.findReplacement(target.title, category) ?? deps.replaceText(target.title)
    }
    if (typeof target.message === 'string') {
      target.message =
        byCode ?? deps.findReplacement(target.message, category) ?? deps.replaceText(target.message)
    }
  }
}

export function createResponseInterceptorHandlers(deps: ResponseInterceptorDeps) {
  // 구조: axios wiring 분리 / 테스트 우선
  const maxRefreshRetries = deps.maxRefreshRetries ?? 3
  let isRefreshing = false
  let refreshRetryCount = 0
  let failedQueue: PendingQueueItem[] = []

  const processQueue = (error: unknown, token: string | null = null) => {
    // 역할: 대기 요청 일괄 해제
    failedQueue.forEach((pending) => {
      if (error) pending.reject(error)
      else pending.resolve(token)
    })
    failedQueue = []
  }

  const handleAuthFailure = async () => {
    // 규칙: auth 화면 리다이렉트 제외
    const pathname = deps.browserLocation.getPathname()
    if (!pathname) return
    if (shouldSkipAuthFailureRedirect(pathname)) {
      deps.logger.info('[AUTH] Already on auth page - Skip failure handling')
      return
    }

    deps.storage.clear()
    refreshRetryCount = 0

    await deps.showApiError({
      title: '세션 만료',
      message: '세션이 만료되었습니다. 다시 로그인해주세요.'
    })

    deps.browserLocation.assign('/auth/login')
  }

  const onFulfilled = <T extends InterceptorResponse>(response: T): T => {
    normalizeApiPayload(response.data, response.status, deps)

    if (deps.isDev) {
      deps.logger.debug('[API RESPONSE SUCCESS]', {
        status: response.status,
        url: response.config?.url,
        method:
          typeof response.config?.method === 'string'
            ? response.config.method.toUpperCase()
            : undefined,
        data: response.data
      })
    }
    return response
  }

  const onRejected = async (
    error: {
      message?: string
      config?: Record<string, unknown> & { _retry?: boolean; headers?: Record<string, string> }
      response?: { status?: number; statusText?: string; data?: Record<string, unknown> }
    },
    retryRequest: RetryRequest
  ) => {
    const originalRequest = error.config
    normalizeApiPayload(error.response?.data, error.response?.status, deps)

    if (typeof error.response?.data?.message === 'string') {
      error.message = deps.replaceText(error.response.data.message)
    }

    if (
      shouldBypassUnauthorizedRetry({
        status: error.response?.status,
        hasOriginalRequest: Boolean(originalRequest),
        isRetryRequest: Boolean(originalRequest?._retry)
      })
    ) {
      deps.logger.error('[API RESPONSE ERROR]', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        url: error.config?.url,
        method:
          typeof error.config?.method === 'string' ? error.config.method.toUpperCase() : undefined
      })
      return Promise.reject(error)
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // 규칙: refresh 중이면 queue 대기
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        // 선행 refresh가 끝난 뒤 동일한 토큰으로 원래 요청만 다시 보낸다.
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return retryRequest(originalRequest)
      })
    }

    if (refreshRetryCount >= maxRefreshRetries) {
      deps.logger.error('[AUTH] Token refresh max retries exceeded', {
        retryCount: refreshRetryCount,
        maxRetries: maxRefreshRetries
      })
      await handleAuthFailure()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    isRefreshing = true
    refreshRetryCount++

    try {
      deps.logger.info('[AUTH] Token refresh attempt', {
        retryCount: refreshRetryCount,
        maxRetries: maxRefreshRetries
      })

      await deps.runRefreshOnce({ ignoreCooldown: true })
      const newAccessToken = deps.storage.getAccessToken()

      // 결과: 현재 요청 + 대기 요청 재시도
      processQueue(null, newAccessToken)
      refreshRetryCount = 0
      deps.logger.info('[AUTH] Token refresh success')

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }
      return retryRequest(originalRequest)
    } catch (refreshError) {
      deps.logger.error('[AUTH] Token refresh failed', {
        retryCount: refreshRetryCount,
        maxRetries: maxRefreshRetries,
        error: refreshError
      })
      processQueue(refreshError, null)
      await handleAuthFailure()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return {
    onFulfilled,
    onRejected
  }
}
