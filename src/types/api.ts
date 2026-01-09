/**
 * API 응답 공통 구조
 */
export interface ApiResponse<T = any> {
  status: number
  code: string
  title: string
  message: string
  data: T
}

/**
 * 페이지 정렬 정보
 */
export interface PageSort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

/**
 * 페이지 요청 정보
 */
export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: PageSort
  offset: number
  paged: boolean
  unpaged: boolean
}

/**
 * 페이지네이션 응답 (data 부분)
 *
 * @template T - 목록 아이템의 타입
 *
 * @example
 * // 실제 API 응답 구조
 * {
 *   status: 200,
 *   code: "S_OK",
 *   data: {              // ← PaginatedResponse<User>
 *     content: [...],    // User[]
 *     pageable: {...},
 *     totalElements: 10,
 *     // ...
 *   }
 * }
 */
export interface PaginatedResponse<T> {
  /** 실제 데이터 목록 */
  content: T[]
  /** 페이지 요청 정보 */
  pageable: Pageable
  /** 전체 페이지 수 */
  totalPages: number
  /** 전체 요소 수 */
  totalElements: number
  /** 마지막 페이지 여부 */
  last: boolean
  /** 현재 페이지 요소 수 */
  numberOfElements: number
  /** 첫 페이지 여부 */
  first: boolean
  /** 페이지 크기 */
  size: number
  /** 현재 페이지 번호 */
  number: number
  /** 정렬 정보 */
  sort: PageSort
  /** 빈 결과 여부 */
  empty: boolean
}

/**
 * 페이지네이션 요청 파라미터
 */
export interface PageRequest {
  /** 페이지 번호 (0부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 (예: 'createdAt,desc') */
  sort?: string
}
