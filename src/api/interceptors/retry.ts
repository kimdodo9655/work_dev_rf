import type { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import { logger } from '@/utils/logger'

export function setupRetryInterceptor(api: AxiosInstance) {
  axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
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
}
