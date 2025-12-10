import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

import { storage } from '@/utils/storage'

import { API } from './endpoints'

// ============================================================================
// Axios 인스턴스 생성
// ============================================================================
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://register-api.dev.com',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// ============================================================================
// 요청 인터셉터: 토큰 + 금융기관 코드 자동 추가
// ============================================================================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 공개 API 목록 (토큰 불필요)
  const publicUrls = [API.AUTH.LOGIN, API.AUTH.REFRESH]
  const isPublic = publicUrls.some((url) => config.url?.includes(url))

  if (!isPublic) {
    // 1. Authorization 헤더 추가
    const accessToken = storage.getAccessToken()
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // 2. X-Bank-Code 헤더 추가 👈 이 부분 추가
    const bankCode = storage.getBankCode()
    if (bankCode && config.headers) {
      config.headers['X-Bank-Code'] = bankCode
    }
  }

  return config
})

// ============================================================================
// 응답 인터셉터: 401 에러 시 토큰 갱신
// ============================================================================
let isRefreshing = false
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401이 아니거나 이미 재시도한 요청이면 에러 반환
    if (error.response?.status !== 401 || originalRequest._retry) {
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

    originalRequest._retry = true
    isRefreshing = true

    const { refreshToken } = storage.get()

    if (!refreshToken) {
      storage.clear()
      window.dispatchEvent(new CustomEvent('auth:logout'))
      return Promise.reject(error)
    }

    try {
      // 토큰 갱신
      const { data } = await axios.post(`${api.defaults.baseURL}${API.AUTH.REFRESH}`, {
        refreshToken
      })

      const newTokens = data.data
      storage.updateTokens(newTokens)
      processQueue(null, newTokens.accessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
      }
      return api(originalRequest)
    } catch (err) {
      processQueue(err, null)
      storage.clear()
      window.dispatchEvent(new CustomEvent('auth:logout'))
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
