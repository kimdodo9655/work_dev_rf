/**
 * 공통코드 관련 타입 정의
 * @file code.types.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-27
 */

// ============================================================================
// 기본 인터페이스
// ============================================================================

/**
 * 공통코드 기본 인터페이스
 * Schema: CodeResponse
 * API: [P06-01] GET /api/codes/organization-types
 * API: [P06-02] GET /api/codes/organization-statuses
 * API: [P06-03] GET /api/codes/qualified-types
 *      ... 외 23개
 */
export interface Code {
  /** 코드 값 (Enum name) */
  code: string
  /** 코드 설명 */
  description: string
}

/**
 * 권한 레벨 코드 (level 포함)
 * Schema: UserRoleLevelResponse
 * API: [P06-05] GET /api/codes/user-role-levels
 */
export interface RoleLevelCode extends Code {
  /** 권한 레벨 숫자 */
  level: number
}

// ============================================================================
// API 응답 타입
// ============================================================================

/**
 * P06-01
 * GET /api/codes/organization-types
 */
export type GetOrganizationTypesResponse = Code[]

/**
 * P06-02
 * GET /api/codes/organization-statuses
 */
export type GetOrganizationStatusesResponse = Code[]

/**
 * P06-03
 * GET /api/codes/qualified-types
 */
export type GetQualifiedTypesResponse = Code[]

/**
 * P06-04
 * GET /api/codes/branch-statuses
 */
export type GetBranchStatusesResponse = Code[]

/**
 * P06-05
 * GET /api/codes/user-role-levels
 */
export type GetUserRoleLevelsResponse = RoleLevelCode[]

/**
 * P06-06
 * GET /api/codes/registry-types
 */
export type GetRegistryTypesResponse = Code[]

/**
 * P06-07
 * GET /api/codes/registry-causes
 */
export type GetRegistryCausesResponse = Code[]

/**
 * P06-08
 * GET /api/codes/party-types
 */
export type GetPartyTypesResponse = Code[]

/**
 * P06-09
 * GET /api/codes/property-types
 */
export type GetPropertyTypesResponse = Code[]

/**
 * P06-10
 * GET /api/codes/sections
 */
export type GetSectionsResponse = Code[]

/**
 * P06-11
 * GET /api/codes/registry-methods
 */
export type GetRegistryMethodsResponse = Code[]

/**
 * P06-12
 * GET /api/codes/secured-debt-scope-types
 */
export type GetSecuredDebtScopeTypesResponse = Code[]

/**
 * P06-13
 * GET /api/codes/certificate-types
 */
export type GetCertificateTypesResponse = Code[]

/**
 * P06-14
 * GET /api/codes/work-types
 */
export type GetWorkTypesResponse = Code[]

/**
 * P06-15
 * GET /api/codes/payment-statuses
 */
export type GetPaymentStatusesResponse = Code[]

/**
 * P06-16
 * GET /api/codes/adminInfo-linkTime
 */
export type GetAdminInfoLinkTimeResponse = Code[]

/**
 * P06-17
 * GET /api/codes/user-statuses
 */
export type GetUserStatusesResponse = Code[]

/**
 * P06-18
 * GET /api/codes/assigned-works
 */
export type GetAssignedWorksResponse = Code[]

/**
 * P06-19
 * GET /api/codes/progress-statuses
 */
export type GetProgressStatusesResponse = Code[]

/**
 * P06-20
 * GET /api/codes/quote-progress-statuses
 */
export type GetQuoteProgressStatusesResponse = Code[]

/**
 * P06-21
 * GET /api/codes/estimate-writing-statuses
 */
export type GetEstimateWritingStatusesResponse = Code[]

/**
 * P06-22
 * GET /api/codes/estimate-selection-statuses
 */
export type GetEstimateSelectionStatusesResponse = Code[]

/**
 * P06-23
 * GET /api/codes/progress-types
 */
export type GetProgressTypesResponse = Code[]

/**
 * P06-24
 * GET /api/codes/party-roles
 */
export type GetPartyRolesResponse = Code[]

/**
 * P06-25
 * GET /api/codes/party-roles-for-request
 */
export type GetPartyRolesForRequestResponse = Code[]

/**
 * P06-26
 * GET /api/codes/registry-types-for-assign
 */
export type GetRegistryTypesForAssignResponse = Code[]

// ============================================================================
// 통합 응답 타입
// ============================================================================

/**
 * 공통코드 통합 응답 타입
 * 모든 공통코드 카테고리를 포함
 *
 * 주로 초기 로딩 시 모든 코드를 한 번에 불러올 때 사용
 */
export interface CodeResponse {
  /** [P06-01] 기관 구분 목록 */
  organizationTypes: Code[]
  /** [P06-02] 기관 상태 목록 */
  organizationStatuses: Code[]
  /** [P06-03] 자격자 구분 목록 */
  qualifiedTypes: Code[]
  /** [P06-04] 지점 상태 목록 */
  branchStatuses: Code[]
  /** [P06-05] 사용자 권한 레벨 목록 (level 포함) */
  userRoleLevels: RoleLevelCode[]
  /** [P06-06] 등기 유형 목록 */
  registryTypes: Code[]
  /** [P06-07] 등기 원인 목록 */
  registryCauses: Code[]
  /** [P06-08] 당사자 구분 목록 */
  partyTypes: Code[]
  /** [P06-09] 부동산 구분 목록 */
  propertyTypes: Code[]
  /** [P06-10] 구분 목록 */
  sections: Code[]
  /** [P06-11] 등기 방법 목록 */
  registryMethods: Code[]
  /** [P06-12] 채권최고액 범위 구분 목록 */
  securedDebtScopeTypes: Code[]
  /** [P06-13] 증명서 구분 목록 */
  certificateTypes: Code[]
  /** [P06-14] 업무 구분 목록 */
  workTypes: Code[]
  /** [P06-15] 지급 상태 목록 */
  paymentStatuses: Code[]
  /** [P06-16] 행정정보 연계 시점 목록 */
  adminInfoLinkTime: Code[]
  /** [P06-17] 사용자 상태 목록 */
  userStatuses: Code[]
  /** [P06-18] 배정 업무 목록 */
  assignedWorks: Code[]
  /** [P06-19] 진행 상태 목록 */
  progressStatuses: Code[]
  /** [P06-20] 등기 견적 진행 상태 목록 */
  quoteProgressStatuses: Code[]
  /** [P06-21] 등기 견적 작성 여부 목록 */
  estimateWritingStatuses: Code[]
  /** [P06-22] 등기 견적 선정 상태 목록 */
  estimateSelectionStatuses: Code[]
  /** [P06-23] 등기 진행 유형 목록 */
  progressTypes: Code[]
  /** [P06-24] 당사자 구분 목록 */
  partyRoles: Code[]
  /** [P06-25] 당사자 구분 (등기의뢰 계약당사자) 목록 */
  partyRolesForRequest: Code[]
  /** [P06-26] 금융기관 담당(배정) 등기유형 목록 */
  registryTypesForAssign: Code[]
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
 * 대표자 직책
 */
export const REPRESENTATIVE_POSITIONS = {
  CEO: '대표이사',
  MANAGER: '지배인',
  REPRESENTATIVE: '대표자',
  CHAIRMAN: '이사장',
  PRESIDENT: '조합장',
  DIRECTOR: '이사',
  CUSTOM: '직접입력'
} as const

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
// 타입 추출
// ============================================================================

export type RepresentativePosition = keyof typeof REPRESENTATIVE_POSITIONS
export type UserPosition = keyof typeof USER_POSITIONS
export type EmailDomain = keyof typeof EMAIL_DOMAINS
export type ApiAction = keyof typeof API_ACTIONS

// ============================================================================
// 공통코드 유틸 함수
// ============================================================================

/**
 * 공통코드를 SelectOption 배열로 변환
 * @param codeMap 코드 맵 객체
 * @returns SelectOption 배열
 *
 * @example
 * const options = toSelectOptions(REPRESENTATIVE_POSITIONS)
 * // [{ value: 'CEO', label: '대표이사' }, ...]
 */
export function toSelectOptions(codeMap: Record<string, string>) {
  return Object.entries(codeMap).map(([value, label]) => ({
    value,
    label
  }))
}

/**
 * Code 배열을 SelectOption 배열로 변환
 * @param codes Code 배열
 * @returns SelectOption 배열
 *
 * @example
 * const options = codesToSelectOptions(organizationTypes)
 * // [{ value: 'LEGAL_SCRIVENER_OFFICE', label: '법무사 사무소' }, ...]
 */
export function codesToSelectOptions(codes: Code[]) {
  return codes.map((code) => ({
    value: code.code,
    label: code.description
  }))
}

/**
 * Code 배열을 Map으로 변환
 * @param codes Code 배열
 * @returns CodeMap
 *
 * @example
 * const codeMap = codesToMap(organizationTypes)
 * codeMap.get('LEGAL_SCRIVENER_OFFICE') // '법무사 사무소'
 */
export function codesToMap(codes: Code[]): CodeMap {
  return new Map(codes.map((code) => [code.code, code.description]))
}

/**
 * RoleLevelCode 배열을 Map으로 변환
 * @param codes RoleLevelCode 배열
 * @returns RoleLevelCodeMap
 *
 * @example
 * const roleLevelMap = roleLevelCodesToMap(userRoleLevels)
 * roleLevelMap.get('ADMIN') // { level: 90, description: '관리자' }
 */
export function roleLevelCodesToMap(codes: RoleLevelCode[]): RoleLevelCodeMap {
  return new Map(
    codes.map((code) => [code.code, { level: code.level, description: code.description }])
  )
}

/**
 * 코드 값으로 설명 찾기
 * @param codes Code 배열
 * @param code 찾을 코드 값
 * @returns 코드 설명 (없으면 빈 문자열)
 *
 * @example
 * getCodeDescription(organizationTypes, 'LEGAL_SCRIVENER_OFFICE') // '법무사 사무소'
 */
export function getCodeDescription(codes: Code[], code: string): string {
  return codes.find((c) => c.code === code)?.description ?? ''
}
