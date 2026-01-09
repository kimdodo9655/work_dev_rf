/**
 * 로그인 요청
 */
export interface LoginRequest {
  loginId: string
  password: string
}

/**
 * 로그인 응답 데이터
 */
export interface LoginData {
  accessToken: string
  refreshToken: string
  loginId: string
  userId: number
  roleLevel: number
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

/**
 * 토큰 갱신 요청
 */
export interface RefreshRequest {
  refreshToken: string
}

/**
 * 토큰 갱신 응답 데이터
 */
export interface RefreshData {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

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

/**
 * 인증 상태 타입
 */
export type AuthState = 'pre-auth' | 'onboarding' | 'auth'
