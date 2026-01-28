/**
 * 클라이언트 상태 관리 타입
 * @file store.ts
 */

/**
 * 인증 단계 (pre-auth / onboarding / auth)
 */
export type AuthState = 'pre-auth' | 'onboarding' | 'auth'

/**
 * Pinia Auth Store 상태 구조
 */
export interface AuthStoreState {
  /** 로그인 아이디 */
  loginId: string
  /** 사용자 ID */
  userId: number | null
  /** 권한 레벨 */
  roleLevel: number | null
  /** 선택된 금융기관 코드 */
  selectedBankCode: string | null
  /** Access Token 만료 시간 */
  accessExpires: number
  /** Refresh Token 만료 시간 */
  refreshExpires: number
}

/**
 * 로그인 응답 (storage 저장용)
 */
export interface StorageAuthData {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
  loginId: string
  userId: number
  roleLevel: number
  bankCode?: string
}

/**
 * 사용자 권한 레벨 (숫자 값 포함)
 */
export enum UserRoleLevel {
  SUPER_ADMIN = 100,
  ADMIN = 90,
  ORGANIZATION_ADMIN = 80,
  BRANCH_ADMIN = 70,
  USER = 30
}

/**
 * 권한 레벨 타입 (string union)
 */
export type RoleLevelType = keyof typeof UserRoleLevel

/**
 * 권한 레벨 값 가져오기
 * @param roleLevel 권한 레벨 문자열
 * @returns 권한 레벨 숫자 값
 *
 * @example
 * getRoleLevelValue('ADMIN') // 90
 */
export function getRoleLevelValue(roleLevel: RoleLevelType): number {
  return UserRoleLevel[roleLevel]
}

/**
 * 권한 레벨 비교
 * @param userLevel 사용자 권한 레벨
 * @param requiredLevel 필요한 권한 레벨
 * @returns 권한이 충분한지 여부
 *
 * @example
 * hasPermission('ADMIN', 'USER') // true (90 >= 30)
 * hasPermission('USER', 'ADMIN') // false (30 < 90)
 */
export function hasPermission(
  userLevel: RoleLevelType | number,
  requiredLevel: RoleLevelType | number
): boolean {
  const userValue = typeof userLevel === 'number' ? userLevel : UserRoleLevel[userLevel]

  const requiredValue =
    typeof requiredLevel === 'number' ? requiredLevel : UserRoleLevel[requiredLevel]

  return userValue >= requiredValue
}
