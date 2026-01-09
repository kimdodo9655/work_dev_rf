/**
 * 공통코드 기본 인터페이스
 */
export interface Code {
  code: string
  description: string
}

/**
 * 권한 레벨 코드 (level 포함)
 */
export interface RoleLevelCode extends Code {
  level: number
}

/**
 * 공통코드 응답 타입
 */
export interface CodeResponse {
  organizationTypes: Code[]
  organizationStatuses: Code[]
  qualifiedTypes: Code[]
  branchStatuses: Code[]
  userRoleLevels: RoleLevelCode[]
  registryTypes: Code[]
  registryCauses: Code[]
  partyTypes: Code[]
  propertyTypes: Code[]
  sections: Code[]
  registryMethods: Code[]
  securedDebtScopeTypes: Code[]
  certificateTypes: Code[]
  workTypes: Code[]
  paymentStatuses: Code[]
  adminInfoLinkTime: Code[]
  userStatuses: Code[]
}

/**
 * 공통코드 키 타입
 */
export type CodeKey = keyof CodeResponse

/**
 * 공통코드 맵 타입 (빠른 조회를 위한 Map)
 */
export type CodeMap = Map<string, string>
export type RoleLevelCodeMap = Map<string, { level: number; description: string }>
