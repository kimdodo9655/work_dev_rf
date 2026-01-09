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
// 사용자 권한 레벨
// ============================================================================

/**
 * 사용자 권한 레벨 (숫자 값)
 * - 로컬스토리지: role_level
 * - authStore: roleLevel
 * - API 응답: userRoleLevels[].level
 */
export enum UserRoleLevel {
  SUPER_ADMIN = 100, // 시스템 관리자
  ADMIN = 90, // 서비스 관리자
  ORGANIZATION_ADMIN = 80, // 기관 관리자
  BRANCH_ADMIN = 70, // 지점 관리자
  USER = 30 // 사용자
}

/**
 * 권한 레벨 코드 (API 매핑용)
 * - API 응답: userRoleLevels[].code
 */
export const UserRoleCode = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ORGANIZATION_ADMIN: 'ORG_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
  USER: 'USER'
} as const

export type UserRoleCodeType = (typeof UserRoleCode)[keyof typeof UserRoleCode]

/**
 * 권한 레벨(숫자) → 코드(문자열) 매핑
 */
const ROLE_LEVEL_TO_CODE: Record<UserRoleLevel, UserRoleCodeType> = {
  [UserRoleLevel.SUPER_ADMIN]: UserRoleCode.SUPER_ADMIN,
  [UserRoleLevel.ADMIN]: UserRoleCode.ADMIN,
  [UserRoleLevel.ORGANIZATION_ADMIN]: UserRoleCode.ORGANIZATION_ADMIN,
  [UserRoleLevel.BRANCH_ADMIN]: UserRoleCode.BRANCH_ADMIN,
  [UserRoleLevel.USER]: UserRoleCode.USER
}

/**
 * 코드(문자열) → 권한 레벨(숫자) 매핑
 */
const ROLE_CODE_TO_LEVEL: Record<UserRoleCodeType, UserRoleLevel> = {
  [UserRoleCode.SUPER_ADMIN]: UserRoleLevel.SUPER_ADMIN,
  [UserRoleCode.ADMIN]: UserRoleLevel.ADMIN,
  [UserRoleCode.ORGANIZATION_ADMIN]: UserRoleLevel.ORGANIZATION_ADMIN,
  [UserRoleCode.BRANCH_ADMIN]: UserRoleLevel.BRANCH_ADMIN,
  [UserRoleCode.USER]: UserRoleLevel.USER
}

/**
 * 권한 레벨 숫자 → API 코드 문자열 변환
 */
export function getUserRoleCode(level: UserRoleLevel): UserRoleCodeType {
  return ROLE_LEVEL_TO_CODE[level]
}

/**
 * API 코드 문자열 → 권한 레벨 숫자 변환
 */
export function getUserRoleLevel(code: UserRoleCodeType): UserRoleLevel {
  return ROLE_CODE_TO_LEVEL[code]
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

/**
 * CustomSelect 컴포넌트에서 사용되는 타입 정의
 */

/**
 * CustomSelect 컴포넌트 Props
 */
export interface CustomSelectProps {
  /** v-model로 바인딩될 선택된 값 */
  modelValue: string | number | null
  /** 셀렉트 옵션 배열 */
  options: SelectOption[]
  /** placeholder 텍스트 */
  placeholder?: string
  /** 셀렉트 비활성화 여부 */
  disabled?: boolean
}

/**
 * CustomSelect 컴포넌트 Emits
 */
export interface CustomSelectEmits {
  /** v-model 업데이트 이벤트 */
  (e: 'update:modelValue', value: string | number): void
  /** 값 변경 이벤트 */
  (e: 'change', value: string | number): void
}

// ============================================================================
// 외부 링크 타입
// ============================================================================
export type { ExternalLinks } from '@/constants/externalLinks'

// ============================================================================
// 공통코드 타입
// ============================================================================
export type {
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap
} from '@/types/code'

// ============================================================================
// 에러 관련 타입
// ============================================================================

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
