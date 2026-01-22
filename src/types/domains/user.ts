/**
 * 사용자 관련 타입 정의
 * @file src/types/domains/user.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 * 수정일: 2025-01-21 (API 문서 기반 재검증)
 */

import type { AssignedBankInfo, UserAssignedBankItem } from './branch'

/**
 * 사용자 기본 정보
 * Schema: UserItem
 */
export interface UserItem {
  /** 사용자 이름 */
  name: string
  /** 사용자 직책 */
  position: string
  /** 권한 레벨 (100: 시스템관리자, 90: 관리자, 80: 기관관리자, 70: 지점관리자, 30: 사용자) */
  roleLevel: number
  /** 사용자 전화번호 */
  phone: string
  /** 사용자 내선번호 */
  extension: string
  /** 이메일 */
  email: string
  /** 사용자 아이디 */
  loginId: string
  /** 비밀번호 */
  password: string
}

/**
 * 사용자 생성 요청
 * Schema: UserCreateRequest
 * API: POST /api/users
 */
export interface UserCreateRequest {
  /** 지점 ID */
  branchId: number
  /** MAC 주소 */
  macAddress: string
  /** 사용자 기본 정보 */
  user: UserItem
  /** 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}

/**
 * 사용자 생성 응답
 * Schema: UserCreateResponse
 * API: POST /api/users
 */
export interface UserCreateResponse {
  /** 사용자 ID */
  userId: number
  /** 사용자 이름 */
  userName: string
}

/**
 * 사용자 수정 요청
 * Schema: UserUpdateRequest
 * API: PATCH /api/users/{userId}
 */
export interface UserUpdateRequest {
  /** 지점 ID */
  branchId: number
  /** 사용자 직책 */
  position: string
  /** 사용자 권한 레벨: 시스템관리자(100), 관리자(90), 기관관리자(80), 지점관리자(70), 사용자(30) */
  roleLevel: number
  /** 사용자 전화번호 */
  phone: string
  /** 사용자 내선번호 */
  extension: string
  /** MAC 주소 */
  macAddress: string
  /** 이메일 */
  email: string
  /** 비밀번호 (선택) */
  password?: string
  /** 사용자 상태 */
  userStatus: string
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}

/**
 * 내 정보 수정 요청
 * Schema: UserSelfUpdateRequest
 * API: PATCH /api/users/profile
 */
export interface UserSelfUpdateRequest {
  /** 이메일 */
  email: string
  /** 전화번호 */
  phone: string
  /** 내선번호 */
  extension: string
  /** 직책 */
  position: string
  /** 비밀번호 (선택) */
  password?: string
}

/**
 * 사용자 상세 응답
 * Schema: UserDetailResponse
 * API: GET /api/users/{userId}, GET /api/users/profile
 */
export interface UserDetailResponse {
  /** 지점 ID */
  branchId: number
  /** 기관 ID */
  organizationId: number
  /** 기관 구분 */
  organizationType: string
  /** 기관 구분 설명 */
  organizationTypeDescription: string
  /** 기관 명칭 */
  organizationName: string
  /** 지점 명칭 */
  branchName: string
  /** 로그인 아이디 */
  loginId: string
  /** 사용자 이름 */
  name: string
  /** 권한 레벨 코드 */
  roleLevel: string
  /** 사용권한값 */
  roleLevelValue: number
  /** 사용권한명 */
  roleLevelName: string
  /** 전화번호 */
  phone: string
  /** 내선번호 */
  extension: string
  /** 등록단말기(MAC주소) */
  macAddress: string
  /** 이메일 */
  email: string
  /** 사용자 상태 */
  userStatus: string
  /** 사용유무 설명 */
  userStatusDescription: string
  /** 배정 금융기관 목록 */
  assignedBanks: AssignedBankInfo[]
}

/**
 * 사용자 목록 아이템
 * Schema: UserResponse
 * API: GET /api/users/search
 */
export interface UserListItem {
  /** 순번 */
  rowNumber: number
  /** 사용자 ID */
  userId: number
  /** 지점 ID */
  branchId: number
  /** 기관 구분 */
  organizationType: string
  /** 기관 구분 설명 */
  organizationTypeDescription: string
  /** 기관명칭 */
  organizationName: string
  /** 지점명칭 */
  branchName: string
  /** 로그인 아이디 */
  loginId: string
  /** 사용자 이름 */
  name: string
  /** 권한 레벨 코드 */
  roleLevel: string
  /** 사용권한값 */
  roleLevelValue: number
  /** 사용권한명 */
  roleLevelName: string
  /** 이메일 인증 여부 */
  isEmailVerified: boolean
  /** 사용자 상태 */
  userStatus: string
  /** 사용유무 설명 */
  userStatusDescription: string
}

/**
 * 업무배정 가능 담당자 정보
 * Schema: UserAssignableResponse
 * API: GET /api/users/assignable
 */
export interface UserAssignable {
  /** 사용자 ID */
  userId: number
  /** 사용자명 */
  userName: string
  /** 소유권이전 등기유형 보유 여부 */
  hasOwnershipTransfer: boolean
  /** 근저당권설정 등기유형 보유 여부 */
  hasMortgageRegistration: boolean
}

/**
 * 담당 금융기관 요약 정보
 * Schema: UserAssignedBankSummaryResponse
 * API: GET /api/users/assigned-banks
 */
export interface UserAssignedBankSummary {
  /** 금융기관 코드 */
  bankCode: string
  /** 금융기관명 */
  bankName: string
  /** 금융권 (1: 1금융권, 2: 2금융권) */
  tier: number
  /** 소유권이전 여부 */
  hasOwnershipTransfer: boolean
  /** 근저당권설정 여부 */
  hasMortgageRegistration: boolean
}

/**
 * 사용자 검색 파라미터
 * API: GET /api/users/search
 */
export interface UserSearchParams {
  /** 검색 키워드 */
  keyword?: string
  /** 기관 ID */
  organizationId?: number
  /** 지점 ID */
  branchId?: number
  /** 사용자 상태 */
  userStatus?:
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'ACTIVE'
    | 'EMAIL_UNVERIFIED'
    | 'TEMPORARY_APPROVAL'
    | 'INACTIVE'
    | 'DELETED'
  /** 권한 레벨 */
  roleLevel?: 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZATION_ADMIN' | 'BRANCH_ADMIN' | 'USER'
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string
}

/**
 * 사용자 목록 파라미터 (별칭)
 */
export type UserListParams = UserSearchParams

// 하위 호환성을 위한 별칭 (deprecated)
/** @deprecated UserAssignedBankItem을 사용하세요 */
export type UserAssignedBank = UserAssignedBankItem
