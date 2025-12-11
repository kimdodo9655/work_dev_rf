import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

export function useErrorHandler() {
  const router = useRouter()
  const authStore = useAuthStore()

  /**
   * API 에러 로깅 (개발자용 - Console)
   * @param error - 에러 객체
   * @param context - 에러 발생 위치 (예: 'CREATE_NOTICE', 'LOGIN' 등)
   */
  function logError(error: any, context?: string) {
    const errorData = {
      context: context || 'UNKNOWN',
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.response?.data?.message || error?.message,
      url: error?.config?.url,
      method: error?.config?.method?.toUpperCase(),
      data: error?.response?.data,
      timestamp: new Date().toISOString()
    }

    logger.error('[API ERROR]', errorData)
  }

  /**
   * 에러 메시지 추출
   */
  function getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    if (error?.message) {
      return error.message
    }
    return '알 수 없는 오류가 발생했습니다.'
  }

  /**
   * HTTP 상태 코드 가져오기
   */
  function getStatusCode(error: any): number | null {
    return error?.response?.status || null
  }

  /**
   * 401 에러 자동 처리 (로그아웃)
   *
   * ⚠️ 주의: 401 에러는 Axios 인터셉터(client.ts)에서 자동으로 처리되므로
   * 일반적으로 이 함수가 호출될 일은 없습니다.
   * 인터셉터를 거치지 않는 특수한 경우에만 사용하세요.
   */
  function handleUnauthorized() {
    logger.warn('[AUTH] Unauthorized - Auto logout')
    authStore.clearAuth()
    router.push('/auth/auto-logout')
  }

  /**
   * 403 에러 자동 처리 (권한 없음)
   */
  function handleForbidden() {
    logger.warn('[AUTH] Forbidden - Redirect to 404')
    router.push('/error/404')
  }

  /**
   * 기본 에러 처리
   * - Console 로깅
   * - 403 자동 처리
   *
   * ⚠️ 주의: 401 에러는 Axios 인터셉터에서 자동 처리되므로 여기서는 처리하지 않습니다.
   */
  function handleError(error: any, context?: string) {
    // Console 로깅
    logError(error, context)

    const status = getStatusCode(error)

    // 자동 처리가 필요한 에러
    switch (status) {
      // ✅ 개선: 401 에러는 Axios 인터셉터에서 자동 처리되므로 제거
      // case 401:
      //   handleUnauthorized()
      //   break
      case 403:
        handleForbidden()
        break
    }
  }

  return {
    logError,
    getErrorMessage,
    getStatusCode,
    handleError,
    handleUnauthorized, // 특수한 경우를 위해 export는 유지
    handleForbidden
  }
}
