/**
 * 문서 경로: `@/src/types/error.ts`
 * 문서 제목: 타입 정의: error
 */

/**
 * API 에러 타입
 */
export interface ApiError {
  status: number
  code?: string
  message: string
  data?: unknown
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

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

/**
 * Axios 에러를 ApiError로 변환
 */
export function toApiError(error: unknown): ApiError {
  const errorRecord = toRecord(error)
  const response = toRecord(errorRecord?.response)
  const responseData = toRecord(response?.data)
  const config = toRecord(errorRecord?.config)
  const method = typeof config?.method === 'string' ? config.method.toUpperCase() : undefined

  return {
    status: typeof response?.status === 'number' ? response.status : 0,
    code: typeof responseData?.code === 'string' ? responseData.code : 'UNKNOWN_ERROR',
    message:
      (typeof responseData?.message === 'string' && responseData.message) ||
      (typeof errorRecord?.message === 'string' && errorRecord.message) ||
      '알 수 없는 오류',
    data: response?.data,
    url: typeof config?.url === 'string' ? config.url : undefined,
    method,
    timestamp: new Date().toISOString()
  }
}
