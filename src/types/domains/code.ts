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

// ============================================================================
// 공통코드 상수
// ============================================================================

/**
 * 사용자 직책
 */
export const USER_POSITIONS = {
  STAFF: '사원',
  ASSISTANT: '주임',
  ASSOCIATE: '대리',
  MANAGER: '과장',
  GENERAL_MANAGER: '부장',
  CHIEF_CLERK: '사무장',
  DIRECTOR: '이사',
  EXECUTIVE_DIRECTOR: '대표이사',
  PRESIDENT: '사장',
  MANAGER_ENG: '매니저',
  CUSTOM: '직접입력'
} as const

/**
 * 이메일 도메인
 */
export const EMAIL_DOMAINS = {
  GMAIL: 'gmail.com',
  NAVER: 'naver.com',
  DAUM: 'daum.net',
  CUSTOM: '직접입력'
} as const

/**
 * API Action 값
 */
export const API_ACTIONS = {
  ADD: 'ADD',
  MODIFY: 'MODIFY',
  DELETE: 'DELETE'
} as const

// ============================================================================
// 공통코드 유틸 함수
// ============================================================================

/**
 * 공통코드를 SelectOption 배열로 변환
 */
export function toSelectOptions(codeMap: Record<string, string>) {
  return Object.entries(codeMap).map(([value, label]) => ({
    value,
    label
  }))
}
