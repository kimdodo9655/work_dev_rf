/**
 * API 에러 타입
 */
export interface APIError {
  status: number
  code: string
  title: string
  message: string
  timestamp?: string
  path?: string
}

/**
 * 에러 심각도
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * 에러 처리 옵션
 */
export interface ErrorHandlerOptions {
  showToast?: boolean // Toast 메시지 표시 여부
  showModal?: boolean // Modal 표시 여부
  silent?: boolean // 조용히 처리 (로그만)
  customMessage?: string // 커스텀 메시지
  onError?: (error: APIError) => void // 커스텀 핸들러
}
