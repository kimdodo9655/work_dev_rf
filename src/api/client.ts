import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'

import { API } from '@/api/endpoints'
import { useAuthStore } from '@/stores/auth'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

// ============================================================================
// Axios 인스턴스 생성
// ============================================================================
export const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// ============================================================================
// 네트워크 재시도 설정 (신규 추가)
// ============================================================================
axiosRetry(api, {
  retries: 3, // 최대 3번 재시도
  retryDelay: axiosRetry.exponentialDelay, // 지수 백오프 (1초, 2초, 4초...)
  retryCondition: (error) => {
    // 네트워크 오류 또는 5xx 서버 에러만 재시도
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500
    )
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn('[API RETRY]', {
      retryCount,
      url: requestConfig.url,
      method: requestConfig.method?.toUpperCase(),
      error: error.message
    })
  }
})

// ============================================================================
// Refresh Single-flight + Cooldown + Multi-tab Sync
// ============================================================================
let refreshPromise: Promise<void> | null = null
let lastRefreshTime = 0 // 마지막 refresh 성공 시간
const REFRESH_COOLDOWN = 60 * 10000 // 10분

const authChannel =
  typeof window !== 'undefined' ? new BroadcastChannel('auth-refresh-channel') : null

authChannel?.addEventListener('message', (event) => {
  const { type } = event.data || {}

  if (type === 'REFRESH_SUCCESS') {
    lastRefreshTime = Date.now()
    logger.info('[AUTH][BC] Refresh success synced from another tab')
  }

  if (type === 'REFRESH_FAIL') {
    logger.warn('[AUTH][BC] Refresh failed in another tab')
  }
})

// ============================================================================
// 공개 API 판별 함수 (하이브리드 방식)
// ============================================================================
function isPublicUrl(url: string | undefined): boolean {
  if (!url) return false

  // 1. 개별 지정 API (명확한 경로)
  const explicitPublicUrls = [
    API.AUTH.LOGIN, // 로그인
    API.AUTH.LOGOUT // 로그아웃
  ]

  // 2. 패턴 매칭 API (/* 하위 경로 전체)
  const publicPatterns = [
    '/api/auth/', // /api/auth/* 전체
    '/api/codes/' // /api/codes/* 전체 (공통코드)
  ]

  // 3. 개별 제외 API (패턴에 포함되지만 검증 필요한 경우)
  const explicitPrivateUrls = [
    API.AUTH.REFRESH // /api/auth/refresh는 검증 필요
  ]

  // 먼저 명시적 private 체크 (최우선)
  if (explicitPrivateUrls.some((privateUrl) => url.includes(privateUrl))) {
    return false // 검증 필요
  }

  // 개별 지정 또는 패턴 매칭 확인
  return (
    explicitPublicUrls.some((publicUrl) => url.includes(publicUrl)) ||
    publicPatterns.some((pattern) => url.includes(pattern))
  )
}

// ============================================================================
// 세션 연장 제외 API 판별 함수
// ============================================================================
function shouldSkipAutoRefresh(url: string | undefined): boolean {
  if (!url) return true

  // 세션 연장 제외 API
  const skipUrls = [
    API.AUTH.LOGIN,
    API.AUTH.LOGOUT,
    API.AUTH.REFRESH // 세션 연장 API 자체
  ]

  return skipUrls.some((skipUrl) => url.includes(skipUrl))
}

// ============================================================================
// Refresh 실행기 (single-flight)
// - auto refresh: ignoreCooldown=false (쿨다운 적용)
// - 401 refresh:  ignoreCooldown=true  (쿨다운 무시하고 즉시 복구)
// ============================================================================
async function runRefreshOnce({ ignoreCooldown = false }: { ignoreCooldown?: boolean } = {}) {
  const now = Date.now()

  // auto refresh만 쿨다운 적용
  if (!ignoreCooldown && now - lastRefreshTime < REFRESH_COOLDOWN) {
    logger.debug('[REFRESH] Skipped by cooldown', {
      timeSinceLastRefresh: Math.floor((now - lastRefreshTime) / 1000),
      cooldownSeconds: REFRESH_COOLDOWN / 1000
    })
    return
  }

  // 이미 진행 중이면 같은 Promise 공유
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const { refreshToken } = storage.get()
      if (!refreshToken) throw new Error('No refresh token')

      // ✅ auth 상태인지 확인 (onboarding/auth state)
      const bankCode = storage.getBankCode()

      if (!bankCode && !refreshToken) {
        logger.debug('[REFRESH] Skipped - Not in auth state (no bankCode)')
        return
      }

      logger.info('[REFRESH] Refresh started', { ignoreCooldown })

      // 인터셉터 회피를 위해 axios 직접 호출
      const { data } = await axios.post(`${ENV.API_BASE_URL}${API.AUTH.REFRESH}`, { refreshToken })

      const newTokens = data.data

      storage.updateTokens(newTokens)
      useAuthStore().updateTokens(newTokens)

      // 성공 직후 시각으로 갱신
      lastRefreshTime = Date.now()

      // 다른 탭에 성공 알림
      authChannel?.postMessage({ type: 'REFRESH_SUCCESS' })
      logger.info('[REFRESH] Refresh success')
    } catch (error) {
      authChannel?.postMessage({ type: 'REFRESH_FAIL' })
      logger.error('[REFRESH] Refresh failed', { error })
      throw error
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// ============================================================================
// 개발 환경 요청 로깅 (신규 추가)
// ============================================================================
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

// ============================================================================
// 요청 인터셉터: 토큰 + 금융기관 코드 자동 추가 + 인증 데이터 검증 + 자동 세션 연장
// ============================================================================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  logger.debug('[REQ]', { url: config.url, isPublic: isPublicUrl(config.url) })

  // 공개 API는 검증 제외
  if (isPublicUrl(config.url)) {
    return config
  }

  // ✅ 인증 데이터 검증 (API 요청 전 필수값 체크)
  const authData = storage.get()

  if (!isValidAuthData(authData)) {
    logger.error('[API] Invalid auth data detected before request', {
      url: config.url,
      method: config.method?.toUpperCase()
    })
    handleInvalidAuthState()
    return Promise.reject(new Error('Invalid auth data'))
  }

  // 1. Authorization 헤더 추가
  const accessToken = storage.getAccessToken()
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  // 2. X-Bank-Code 헤더 추가
  const bankCode = storage.getBankCode()
  if (bankCode && config.headers) {
    config.headers['X-Bank-Code'] = bankCode
  }

  // ✅ 3. 자동 세션 연장 (백그라운드 실행)
  if (!shouldSkipAutoRefresh(config.url)) {
    // onboarding/auth 상태(bankCode)에서만 트리거
    if (bankCode) {
      // await 없이 백그라운드 실행 (API 호출 지연 방지)
      runRefreshOnce({ ignoreCooldown: false }).catch((err) => {
        logger.warn('[AUTO_REFRESH] Background refresh failed', { error: err })
      })
    }
  }

  return config
})

// ============================================================================
// 응답 인터셉터: 401 에러 시 토큰 갱신 + 에러 로깅
// ============================================================================

/** 토큰 갱신 최대 재시도 횟수 */
const MAX_REFRESH_RETRIES = 3

let isRefreshing = false
let refreshRetryCount = 0
let failedQueue: Array<{
  resolve: (token: string | null) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const handleAuthFailure = () => {
  if (typeof window === 'undefined') return

  // 이미 인증 관련 페이지면 중복 처리 방지
  if (window.location.pathname.startsWith('/auth/')) {
    logger.info('[AUTH] Already on auth page - Skip failure handling')
    return
  }

  storage.clear()
  refreshRetryCount = 0

  // 알림 표시
  alert('세션이 만료되었습니다. 다시 로그인해주세요.')

  // 로그인 페이지로 이동
  window.location.href = '/auth/login'
}

api.interceptors.response.use(
  (response) => {
    // ✅ 개발 환경에서 성공 응답 로깅
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

    // 401이 아니거나 이미 재시도한 요청이면 에러 반환
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

    // 이미 갱신 중이면 큐에 추가
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

    // 최대 재시도 횟수 초과 체크
    if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
      logger.error('[AUTH] Token refresh max retries exceeded', {
        retryCount: refreshRetryCount,
        maxRetries: MAX_REFRESH_RETRIES
      })
      handleAuthFailure()
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

      // ✅ 401은 쿨다운 무시하고 즉시 복구
      await runRefreshOnce({ ignoreCooldown: true })

      const newAccessToken = storage.getAccessToken()

      processQueue(null, newAccessToken)

      // 성공 시 재시도 카운트 초기화
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
      handleAuthFailure()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

// ============================================================================
// 공통 API 헬퍼 함수 (타임아웃 세분화)
// ============================================================================
export const apiHelpers = {
  /**
   * GET 요청
   * @param url - 요청 URL
   * @param params - 쿼리 파라미터
   * @param timeout - 타임아웃 (기본: 30초)
   */
  async get<T>(url: string, params?: any, timeout = 30000): Promise<T> {
    const response = await api.get<T>(url, { params, timeout })
    return response.data
  },

  /**
   * POST 요청
   * @param url - 요청 URL
   * @param data - 요청 바디
   * @param timeout - 타임아웃 (기본: 30초)
   */
  async post<T>(url: string, data?: any, timeout = 30000): Promise<T> {
    const response = await api.post<T>(url, data, { timeout })
    return response.data
  },

  /**
   * PUT 요청 (전체 수정)
   * @param url - 요청 URL
   * @param data - 요청 바디
   * @param timeout - 타임아웃 (기본: 30초)
   */
  async put<T>(url: string, data?: any, timeout = 30000): Promise<T> {
    const response = await api.put<T>(url, data, { timeout })
    return response.data
  },

  /**
   * PATCH 요청 (부분 수정)
   * @param url - 요청 URL
   * @param data - 요청 바디
   * @param timeout - 타임아웃 (기본: 30초)
   */
  async patch<T>(url: string, data?: any, timeout = 30000): Promise<T> {
    const response = await api.patch<T>(url, data, { timeout })
    return response.data
  },

  /**
   * DELETE 요청
   * @param url - 요청 URL
   * @param timeout - 타임아웃 (기본: 30초)
   */
  async delete<T>(url: string, timeout = 30000): Promise<T> {
    const response = await api.delete<T>(url, { timeout })
    return response.data
  },

  /**
   * 파일 업로드
   * @param url - 요청 URL
   * @param file - 업로드할 파일
   * @param onProgress - 업로드 진행률 콜백
   * @param timeout - 타임아웃 (기본: 60초, 파일 업로드는 더 길게)
   */
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    timeout = 60000
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      }
    })
    return response.data
  }
}
