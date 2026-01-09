/**
 * API 에러 타입
 */
export interface ApiError {
  status: number
  code?: string
  message: string
  data?: any
  url?: string
  method?: string
  timestamp: string
}

/**
 * API 에러 가드 함수
 */
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error && 'message' in error
}

/**
 * Axios 에러를 ApiError로 변환
 */
export function toApiError(error: any): ApiError {
  return {
    status: error?.response?.status || 0,
    code: error?.response?.data?.code || 'UNKNOWN_ERROR',
    message: error?.response?.data?.message || error?.message || '알 수 없는 오류',
    data: error?.response?.data,
    url: error?.config?.url,
    method: error?.config?.method?.toUpperCase(),
    timestamp: new Date().toISOString()
  }
}
