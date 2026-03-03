/**
 * 문서 경로: `@/src/api/client.ts`
 * 문서 제목: client 구현 파일
 */

import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { setupRequestInterceptor } from '@/api/interceptors/request'
import { setupResponseInterceptor } from '@/api/interceptors/response'
import { setupRetryInterceptor } from '@/api/interceptors/retry'
import { ENV } from '@/utils/env'

export const api: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

setupRetryInterceptor(api)
setupRequestInterceptor(api)
setupResponseInterceptor(api)

export const apiHelpers = {
  async get<T>(url: string, params?: unknown, timeout = 30000): Promise<T> {
    const response = await api.get<T>(url, { params, timeout })
    return response.data
  },

  async post<T>(url: string, data?: unknown, timeout = 30000): Promise<T> {
    const response = await api.post<T>(url, data, { timeout })
    return response.data
  },

  async put<T>(url: string, data?: unknown, timeout = 30000): Promise<T> {
    const response = await api.put<T>(url, data, { timeout })
    return response.data
  },

  async patch<T>(url: string, data?: unknown, timeout = 30000): Promise<T> {
    const response = await api.patch<T>(url, data, { timeout })
    return response.data
  },

  async delete<T>(url: string, timeout = 30000): Promise<T> {
    const response = await api.delete<T>(url, { timeout })
    return response.data
  },

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
