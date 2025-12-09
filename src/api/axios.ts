import axios from 'axios'

import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'

const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API Request:', config.method?.toUpperCase(), config.url)

    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logger.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    logger.error('API Response Error:', error.response?.status, error.message)

    if (error.response?.status === 401) {
      logger.warn('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

export default apiClient
