/**
 * 공통코드 관련 타입 정의
 * @file src/types/domains/code.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 공통코드 기본 인터페이스
 * Schema: CodeResponse
 * API: [P06-01] GET /api/codes/organization-types
 * API: [P06-02] GET /api/codes/organization-statuses
 * API: [P06-03] GET /api/codes/qualified-types
 *      ... 외 18개
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

/**
 * 공통코드 응답 타입
 * 모든 공통코드 카테고리를 포함
 * API: [P06-01~23] GET /api/codes/*
 */
export interface CodeResponse {
  /** 기관 구분 목록 */
  organizationTypes: Code[]
  /** 기관 상태 목록 */
  organizationStatuses: Code[]
  /** 자격자 구분 목록 */
  qualifiedTypes: Code[]
  /** 지점 상태 목록 */
  branchStatuses: Code[]
  /** 사용자 권한 레벨 목록 (level 포함) */
  userRoleLevels: RoleLevelCode[]
  /** 등기 유형 목록 */
  registryTypes: Code[]
  /** 등기 원인 목록 */
  registryCauses: Code[]
  /** 당사자 구분 목록 */
  partyTypes: Code[]
  /** 부동산 구분 목록 */
  propertyTypes: Code[]
  /** 구분 목록 */
  sections: Code[]
  /** 등기 방법 목록 */
  registryMethods: Code[]
  /** 채권최고액 범위 구분 목록 */
  securedDebtScopeTypes: Code[]
  /** 증명서 구분 목록 */
  certificateTypes: Code[]
  /** 업무 구분 목록 */
  workTypes: Code[]
  /** 지급 상태 목록 */
  paymentStatuses: Code[]
  /** 행정정보 연계 시점 목록 */
  adminInfoLinkTime: Code[]
  /** 사용자 상태 목록 */
  userStatuses: Code[]
  /** 진행 상태 목록 */
  progressStatuses: Code[]
  /** 등기 견적 진행 상태 목록 */
  quoteProgressStatuses: Code[]
  /** 등기 견적 작성 여부 목록 */
  estimateWritingStatuses: Code[]
  /** 등기 견적 선정 상태 목록 */
  estimateSelectionStatuses: Code[]
  /** 배정 업무 목록 */
  assignmentWorks: Code[]
  /** 등기 진행 유형 목록 (P06-23) 🆕 */
  progressTypes: Code[]
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
