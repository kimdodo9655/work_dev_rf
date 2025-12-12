import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/auth'
import { handleInvalidAuthState, isValidAuthData } from '@/utils/authValidator'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'

import { API } from './endpoints'

// ============================================================================
// Axios 인스턴스 생성
// ============================================================================
export const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// ============================================================================
// 자동 세션 연장 관련 변수
// ============================================================================
let lastRefreshTime = 0 // 마지막 세션 연장 시간
const REFRESH_COOLDOWN = 60 * 1000 // 1분 (쿨다운 시간)

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
    '/api/auth/' // /api/auth/* 전체
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
// 자동 세션 연장 함수
// ============================================================================
async function autoRefreshSession() {
  const now = Date.now()

  console.log('[DEBUG] autoRefreshSession 호출됨', {
    now,
    lastRefreshTime,
    차이: now - lastRefreshTime,
    쿨다운: REFRESH_COOLDOWN,
    쿨다운체크: now - lastRefreshTime < REFRESH_COOLDOWN
  })

  // ✅ 쿨다운 체크 (1분 이내 중복 호출 방지)
  if (now - lastRefreshTime < REFRESH_COOLDOWN) {
    logger.debug('[AUTO_REFRESH] Skipped - Cooldown period', {
      timeSinceLastRefresh: Math.floor((now - lastRefreshTime) / 1000),
      cooldownSeconds: REFRESH_COOLDOWN / 1000
    })
    return
  }

  const { refreshToken } = storage.get()

  if (!refreshToken) {
    logger.warn('[AUTO_REFRESH] No refresh token available')
    return
  }

  // ✅ auth 상태인지 확인
  const bankCode = storage.getBankCode()
  if (!bankCode) {
    logger.debug('[AUTO_REFRESH] Skipped - Not in auth state (no bankCode)')
    return
  }

  try {
    logger.info('[AUTO_REFRESH] Auto session refresh triggered')

    const { data } = await axios.post(`${api.defaults.baseURL}${API.AUTH.REFRESH}`, {
      refreshToken
    })

    const newTokens = data.data

    // LocalStorage 업데이트
    storage.updateTokens(newTokens)

    // Auth Store 업데이트
    const authStore = useAuthStore()
    authStore.updateTokens(newTokens)

    // ✅ 성공 시에만 마지막 갱신 시간 업데이트
    lastRefreshTime = now

    console.log('[DEBUG] 세션 연장 성공! lastRefreshTime 업데이트:', lastRefreshTime)

    logger.info('[AUTO_REFRESH] Session refreshed successfully')
  } catch (error) {
    logger.error('[AUTO_REFRESH] Failed to refresh session', { error })
    // ✅ 에러 발생 시 lastRefreshTime 업데이트 안 함 (재시도 가능하도록)
  }
}

// ============================================================================
// 요청 인터셉터: 토큰 + 금융기관 코드 자동 추가 + 인증 데이터 검증 + 자동 세션 연장
// ============================================================================
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
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
    // await 없이 백그라운드 실행 (API 호출 지연 방지)
    autoRefreshSession().catch((err) => {
      logger.warn('[AUTO_REFRESH] Background refresh failed', { error: err })
    })
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401이 아니거나 이미 재시도한 요청이면 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
      // 에러 로깅
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

    const { refreshToken } = storage.get()

    if (!refreshToken) {
      logger.warn('[AUTH] No refresh token available')
      handleAuthFailure()
      return Promise.reject(error)
    }

    try {
      // 토큰 갱신
      logger.info('[AUTH] Token refresh attempt', {
        retryCount: refreshRetryCount,
        maxRetries: MAX_REFRESH_RETRIES
      })
      const { data } = await axios.post(`${api.defaults.baseURL}${API.AUTH.REFRESH}`, {
        refreshToken
      })

      const newTokens = data.data

      // ✅ 개선 #1: LocalStorage 업데이트
      storage.updateTokens(newTokens)

      // ✅ 개선 #2: Auth Store도 업데이트 (타이머 정확도 향상)
      const authStore = useAuthStore()
      authStore.updateTokens(newTokens)

      processQueue(null, newTokens.accessToken)

      // 성공 시 재시도 카운트 초기화
      refreshRetryCount = 0
      logger.info('[AUTH] Token refresh success')

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
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
// 공통 API 헬퍼 함수
// ============================================================================
export const apiHelpers = {
  /**
   * GET 요청
   */
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await api.get<T>(url, { params })
    return response.data
  },

  /**
   * POST 요청
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data)
    return response.data
  },

  /**
   * PUT 요청 (전체 수정)
   */
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put<T>(url, data)
    return response.data
  },

  /**
   * PATCH 요청 (부분 수정)
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await api.patch<T>(url, data)
    return response.data
  },

  /**
   * DELETE 요청
   */
  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url)
    return response.data
  },

  /**
   * 파일 업로드
   */
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
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
