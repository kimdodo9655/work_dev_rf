/**
 * 인증 관련 타입 정의
 * @file src/types/domains/auth.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 로그인 요청
 * Schema: LoginRequest
 * API: POST /api/auth/login
 */
export interface LoginRequest {
  /** 로그인 아이디 */
  loginId: string
  /** 비밀번호 */
  password: string
  /** MAC 주소 (선택) */
  macAddress?: string
}

/**
 * 로그인 응답 데이터
 * Schema: LoginResponse
 * API: POST /api/auth/login
 */
export interface LoginData {
  /** 액세스 토큰 */
  accessToken: string
  /** 리프레시 토큰 */
  refreshToken: string
  /** 로그인 아이디 */
  loginId: string
  /** 사용자 ID */
  userId: number
  /** 사용자 권한 레벨 */
  roleLevel: number
  /** 액세스 토큰 만료 시간 (초) */
  accessTokenExpiresIn: number
  /** 리프레시 토큰 만료 시간 (초) */
  refreshTokenExpiresIn: number
}

/**
 * 토큰 갱신 요청
 * Schema: TokenRefreshRequest
 * API: POST /api/auth/refresh
 */
export interface RefreshRequest {
  /** 리프레시 토큰 */
  refreshToken: string
}

/**
 * 토큰 갱신 응답 데이터
 * Schema: TokenRefreshResponse
 * API: POST /api/auth/refresh
 */
export interface RefreshData {
  /** 액세스 토큰 */
  accessToken: string
  /** 리프레시 토큰 */
  refreshToken: string
  /** 액세스 토큰 만료 시간 (초) */
  accessTokenExpiresIn: number
  /** 리프레시 토큰 만료 시간 (초) */
  refreshTokenExpiresIn: number
}

/**
 * 비밀번호 설정 요청
 * Schema: SetPasswordRequest
 * API: POST /api/auth/password
 */
export interface SetPasswordRequest {
  /** 사용자 ID */
  userId: number
  /** 이메일 인증 토큰 */
  token: string
  /** 새 비밀번호 (8-20자, 영문 대소문자, 숫자, 특수문자 조합) */
  password: string
  /** MAC 주소 (하이픈 또는 콜론 구분) */
  macAddress: string
}

/**
 * 이메일 인증 요청
 * Schema: EmailVerifyRequest
 * API: POST /api/auth/email-verify/validate
 */
export interface EmailVerifyRequest {
  /** 사용자 ID */
  userId: number
  /** 이메일 인증 토큰 */
  token: string
}

/**
 * 이메일 인증 응답
 * Schema: EmailVerifyResponse
 * API: POST /api/auth/email-verify/validate
 */
export interface EmailVerifyResponse {
  /** 사용자 ID */
  userId: number
  /** 사용자 이름 */
  userName: string
  /** 이메일 주소 */
  email: string
  /** 토큰 유효성 */
  tokenValid: boolean
}

/**
 * 사용자 권한 레벨 (숫자 값)
 * - 로컬스토리지: role_level
 * - authStore: roleLevel
 * - API 응답: userRoleLevels[].level
 */
export enum UserRoleLevel {
  /** 시스템 관리자 */
  SUPER_ADMIN = 100,
  /** 서비스 관리자 */
  ADMIN = 90,
  /** 기관 관리자 */
  ORGANIZATION_ADMIN = 80,
  /** 지점 관리자 */
  BRANCH_ADMIN = 70,
  /** 사용자 */
  USER = 30
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

/**
 * 인증 상태 타입
 * - pre-auth: 로그인 전
 * - onboarding: 로그인 후, 금융기관 선택 전
 * - auth: 로그인 후, 금융기관 선택 완료
 */
export type AuthState = 'pre-auth' | 'onboarding' | 'auth'
