/**
 * API 공통 타입 정의
 * @file src/types/api.ts
 *
 * OpenAPI 스펙 기반으로 생성됨
 * 최신 문서: api-docs.json
 * 생성일: 2025-01-21
 */

/**
 * API 응답 래퍼
 * Schema: ApiResult*
 *
 * 모든 API 응답의 기본 구조
 */
export interface ApiResponse<T = any> {
  /** HTTP 상태 코드 */
  status: number
  /** 응답 코드 */
  code: string
  /** 응답 제목 */
  title: string
  /** 응답 메시지 */
  message: string
  /** 응답 데이터 */
  data: T
}

/**
 * 페이지네이션 응답
 *
 * 목록 조회 API의 표준 응답 구조
 */
export interface PaginatedResponse<T> {
  /** 데이터 목록 */
  content: T[]
  /** 페이지 정보 */
  pageable: Pageable
  /** 전체 요소 개수 */
  totalElements: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 마지막 페이지 여부 */
  last: boolean
  /** 현재 페이지 크기 */
  size: number
  /** 현재 페이지 번호 (0부터 시작) */
  number: number
  /** 정렬 정보 */
  sort: Sort
  /** 첫 페이지 여부 */
  first: boolean
  /** 현재 페이지의 요소 개수 */
  numberOfElements: number
  /** 빈 페이지 여부 */
  empty: boolean
}

/**
 * 페이지 정보
 */
export interface Pageable {
  /** 페이지 번호 (0부터 시작) */
  pageNumber: number
  /** 페이지 크기 */
  pageSize: number
  /** 정렬 정보 */
  sort: Sort
  /** 오프셋 */
  offset: number
  /** 페이지 여부 */
  paged: boolean
  /** 페이지 없음 여부 */
  unpaged: boolean
}

/**
 * 정렬 정보
 */
export interface Sort {
  /** 정렬됨 여부 */
  sorted: boolean
  /** 정렬 안됨 여부 */
  unsorted: boolean
  /** 빈 정렬 여부 */
  empty: boolean
}

/**
 * 페이지 요청 파라미터
 *
 * 목록 조회 API의 표준 요청 파라미터
 */
export interface PageRequest {
  /** 페이지 번호 (0부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 (예: 'createdAt,desc') */
  sort?: string
}

/**
 * 에러 응답
 */
export interface ErrorResponse {
  /** HTTP 상태 코드 */
  status: number
  /** 에러 코드 */
  code: string
  /** 에러 제목 */
  title: string
  /** 에러 메시지 */
  message: string
  /** 에러 상세 정보 */
  errors?: Array<{
    field: string
    message: string
  }>
  /** 타임스탬프 */
  timestamp: string
  /** 요청 경로 */
  path?: string
}
