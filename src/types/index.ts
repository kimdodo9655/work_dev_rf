// ============================================================================
// 공통 API 타입
// ============================================================================

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
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  numberOfElements: number
  first: boolean
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  empty: boolean
}

// ============================================================================
// 인증 관련 타입
// ============================================================================

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginData {
  accessToken: string
  refreshToken: string
  loginId: string
  userId: number
  roleLevel: number
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshData {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

// ============================================================================
// 공통 유틸리티 타입
// ============================================================================

/**
 * Select 옵션
 */
export interface SelectOption<T = string | number> {
  value: T
  label: string
  disabled?: boolean
}

/**
 * 테이블 컬럼
 */
export interface TableColumn {
  key: string
  label: string
  width?: string
  minWidth?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}
