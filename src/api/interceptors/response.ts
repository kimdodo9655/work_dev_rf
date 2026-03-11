/**
 * 문서 경로: `@/src/api/interceptors/response.ts`
 * 문서 제목: API 인터셉터: response
 */

import type { AxiosInstance } from 'axios'

import { runRefreshOnce } from '@/api/interceptors/refresh'
import { useApiAlert } from '@/composables/utils/useApiAlert'
import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { browserLocation } from '@/utils/browser'
import { ENV } from '@/utils/env'
import { logger } from '@/utils/logger'
import { createResponseInterceptorHandlers } from '@/utils/responseInterceptor'
import { storage } from '@/utils/storage'

const { showApiError } = useApiAlert()
const { findReplacement, replaceText } = useCodeReplacer()

export function setupResponseInterceptor(api: AxiosInstance) {
  const handlers = createResponseInterceptorHandlers({
    runRefreshOnce,
    showApiError,
    findReplacement,
    replaceText,
    storage,
    browserLocation,
    logger,
    isDev: ENV.IS_DEV
  })

  api.interceptors.response.use(
    (response) => handlers.onFulfilled(response),
    (error) => handlers.onRejected(error, (request) => api(request))
  )
}
