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
// 금융기관 관련 타입
// ============================================================================

export interface Bank {
  code: string
  name: string
  tier: number
  isActive: boolean
}

export type BankList = Bank[]

// ============================================================================
// Role Level 상수
// ============================================================================

export enum RoleLevel {
  SUPER_ADMIN = 100, // 시스템 관리자
  ADMIN = 90, // 서비스 관리자
  ORGANIZATION_ADMIN = 80, // 기관 관리자
  BRANCH_ADMIN = 70, // 지점 관리자
  USER = 30 // 사용자
}

export const ROLE_LABELS: Record<RoleLevel, string> = {
  [RoleLevel.SUPER_ADMIN]: '시스템 관리자',
  [RoleLevel.ADMIN]: '서비스 관리자',
  [RoleLevel.ORGANIZATION_ADMIN]: '기관 관리자',
  [RoleLevel.BRANCH_ADMIN]: '지점 관리자',
  [RoleLevel.USER]: '사용자'
}

// ============================================================================
// 인증 상태 타입
// ============================================================================

export type AuthState = 'pre-auth' | 'onboarding' | 'auth'

// ============================================================================
// 에러 관련 타입
// ============================================================================

/**
 * API 에러 타입
 */
export interface APIError {
  status: number
  code?: string
  message: string
  data?: any
  url?: string
  method?: string
  timestamp: string
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
