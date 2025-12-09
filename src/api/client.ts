import axios from 'axios'
import { storage } from '@/utils/storage'
import { API } from './endpoints'

// Axios 인스턴스
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://register-api.dev.com',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use((config) => {
  // 로그인/리프레시는 토큰 불필요
  const publicUrls = [API.AUTH.LOGIN, API.AUTH.REFRESH]
  const isPublic = publicUrls.some((url) => config.url?.includes(url))

  if (!isPublic) {
    const { accessToken } = storage.get()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  }

  return config
})

// 응답 인터셉터: 401 에러 시 토큰 갱신
let isRefreshing = false
let failedQueue: any[] = []

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

    // 401이 아니거나 이미 재시도한 요청이면 그냥 에러
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // 이미 갱신 중이면 큐에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
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

      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
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
