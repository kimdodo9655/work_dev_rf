/**
 * 문서 경로: `@/src/composables/utils/useErrorHandler.ts`
 * 문서 제목: use Error Handler 구현 파일
 */

/**
 * @file useErrorHandler.ts
 * @description 에러 핸들링 Composable (유틸리티)
 */

import { useCodeReplacer } from '@/composables/utils/useCodeReplacer'
import { isApiError, toApiError } from '@/types'
import { logger } from '@/utils/logger'

/**
 * 에러 핸들링을 위한 Composable
 *
 * @description
 * API 에러를 처리하고 사용자 친화적인 메시지로 변환합니다.
 *
 * @example
 * const { handleError, getErrorMessage } = useErrorHandler()
 *
 * try {
 *   await someAPI()
 * } catch (error) {
 *   handleError(error, 'CREATE_NOTICE')
 * }
 */
export function useErrorHandler() {
  const { findReplacement, replaceText } = useCodeReplacer()

  // ============================================================================
  // Error Handler Functions
  // ============================================================================

  /**
   * API 에러 처리 (토스트 알림 + 로깅)
   * @param error - 에러 객체
   * @param context - 에러 발생 위치 (예: 'CREATE_NOTICE', 'LOGIN' 등)
   */
  function handleError(error: unknown, context?: string) {
    logError(error, context)
    // 토스트 알림 등 추가 가능
  }

  /**
   * API 에러 로깅 (개발자용 - Console)
   * @param error - 에러 객체
   * @param context - 에러 발생 위치 (예: 'CREATE_NOTICE', 'LOGIN' 등)
   */
  function logError(error: unknown, context?: string) {
    const apiError = toApiError(error)

    logger.error('[API ERROR]', {
      context: context || 'UNKNOWN',
      ...apiError
    })
  }

  /**
   * 에러 메시지 추출
   */
  function getErrorMessage(error: unknown): string {
    if (isApiError(error)) {
      return findReplacement(error.code, 'errorCodes') ?? replaceText(error.message)
    }

    const apiError = toApiError(error)
    return findReplacement(apiError.code, 'errorCodes') ?? replaceText(apiError.message)
  }

  /**
   * HTTP 상태 코드 가져오기
   */
  function getStatusCode(error: unknown): number | null {
    if (isApiError(error)) {
      return error.status
    }

    const apiError = toApiError(error)
    return apiError.status || null
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    handleError,
    logError,
    getErrorMessage,
    getStatusCode
  }
}
