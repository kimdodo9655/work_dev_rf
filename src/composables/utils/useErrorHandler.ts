/**
 * @file useErrorHandler.ts
 * @description 에러 핸들링 Composable (유틸리티)
 */

import type { ApiError } from '@/types'
import { logger } from '@/utils/logger'

export function useErrorHandler() {
  // ============================================================================
  // Error Handler
  // ============================================================================

  /**
   * 에러 처리 함수
   */
  const handleError = (error: unknown, context?: string): void => {
    const apiError = error as ApiError

    // 에러 로깅
    logger.error('[ERROR]', {
      context,
      status: apiError?.response?.status,
      message: apiError?.message,
      error
    })

    // TODO: 사용자에게 에러 메시지 표시 (Toast, Alert 등)
    // 예: useMessage().showError(apiError.message)
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    handleError
  }
}
