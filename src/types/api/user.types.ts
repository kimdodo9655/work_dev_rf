/**
 * USER API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  OrganizationType,
  RegistryTypeForAssign,
  RoleLevel,
  UserAssignedBankItem,
  UserItem
} from './common.types'

/**
 * P03-01
 * GET /api/users/profile
 */
export type GetProfileResponse = UserDetailResponse

/**
 * P03-12
 * PATCH /api/users/profile
 */
export type UpdateProfileRequest = UserSelfUpdateRequest

export type UpdateProfileResponse = ApiResultVoid

/**
 * P03-02
 * GET /api/users/search
 */
export interface SearchUsersQuery {
  /** 기관 ID (시스템관리자는 선택, 기관관리자 이하는 자동 설정) */
  organizationId?: number
  /** 지점 ID (지점관리자는 자동 설정) */
  branchId?: number
  /** 사용자 권한 레벨: 시스템관리자(100), 관리자(90), 기관관리자(80), 지점관리자(70), 사용자(30) */
  roleLevel?: number
  /** 이메일 인증 여부 */
  isEmailVerified?: boolean
  /** 검색어 (지점의 사업자등록번호 또는 자격자성명) */
  keyword?: string
  /** 사용자 상태 */
  userStatus?:
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'ACTIVE'
    | 'EMAIL_UNVERIFIED'
    | 'TEMPORARY_APPROVAL'
    | 'INACTIVE'
    | 'DELETED'
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
}

export type SearchUsersResponse = UserResponse

/**
 * P03-03
 * GET /api/users/{userId}
 */
export interface GetUserDetailParams {
  /** 조회할 사용자 ID */
  userId: number
}

export type GetUserDetailResponse = UserDetailResponse

/**
 * P03-04
 * PATCH /api/users/{userId}
 */
export interface UpdateUserParams {
  /** 수정할 사용자 ID */
  userId: number
}

export type UpdateUserRequest = UserUpdateRequest

export type UpdateUserResponse = ApiResultVoid

/**
 * P03-05
 * POST /api/users
 */
export type CreateUserRequest = UserCreateRequest

export type CreateUserResponse = UserCreateResponse

/**
 * P03-06
 * POST /api/users/{userId}/approve
 */
export interface ApproveUserParams {
  /** 승인할 사용자 ID */
  userId: number
}

export type ApproveUserResponse = ApiResultVoid

/**
 * P03-07
 * POST /api/users/{userId}/email-verify
 */
export interface VerifyEmailParams {
  /** 이메일 인증할 사용자 ID */
  userId: number
}

export type VerifyEmailResponse = ApiResultVoid

/**
 * P03-08
 * GET /api/users/assignable
 */
export interface GetAssignableUsersQuery {
  /** 배정업무 */
  assignedWork?: string
}

export type GetAssignableUsersResponse = UserAssignableResponse

/**
 * P03-09
 * GET /api/users/assigned-banks
 */
export type GetAssignedBanks_1Response = UserAssignedBankSummaryResponse

/**
 * P03-10
 * GET /api/users/check-login-id
 */
export interface CheckDuplicateLoginIdQuery {
  /** 확인할 사용자 아이디 */
  loginId: string
}

export type CheckDuplicateLoginIdResponse = boolean

/**
 * P03-11
 * GET /api/users/check-email
 */
export interface CheckDuplicateEmailQuery {
  /** 확인할 사용자 이메일 */
  email: string
}

export type CheckDuplicateEmailResponse = boolean

// ==================== Schemas ====================

/** 배정 금융기관 정보 */
export interface AssignedBankInfo {
  registryType?: RegistryTypeForAssign
  /** 금융기관 코드 */
  bankCode?: string
  /** 금융기관 명칭 */
  bankName?: string
}

/** 업무배정 가능한 사용자 정보 */
export interface UserAssignableResponse {
  /** 사용자 ID */
  userId?: number
  /** 사용자명 */
  userName?: string
  /** 소유권이전 등기유형 보유 여부 */
  hasOwnershipTransfer?: boolean
  /** 근저당권설정 등기유형 보유 여부 */
  hasMortgageRegistration?: boolean
}

/** 사용자 담당 금융기관 요약 응답 */
export interface UserAssignedBankSummaryResponse {
  /** 금융기관 코드 */
  bankCode?: string
  /** 금융기관 명칭 */
  bankName?: string
  /** 금융권 (1: 1금융권, 2: 2금융권) */
  tier?: number
  /** 소유권이전 여부 */
  hasOwnershipTransfer?: boolean
  /** 근저당권설정 여부 */
  hasMortgageRegistration?: boolean
}

/** 사용자 정보 등록 요청 */
export interface UserCreateRequest {
  /** 지점 정보 */
  branchId: number
  user: UserItem
  /** MAC 주소 */
  macAddress: string
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}

/** 사용자 정보 등록 응답 */
export interface UserCreateResponse {
  /** 사용자 ID */
  userId?: number
  /** 사용자 이름 */
  userName?: string
}

/** 사용자 상세 응답 */
export interface UserDetailResponse {
  /** 지점 ID */
  branchId?: number
  /** 기관 ID */
  organizationId?: number
  organizationType?: OrganizationType
  /** 기관 구분 설명 */
  organizationTypeDescription?: string
  /** 기관 명칭 */
  organizationName?: string
  /** 지점 명칭 */
  branchName?: string
  /** 로그인 아이디 */
  loginId?: string
  /** 사용자 이름 */
  name?: string
  roleLevel?: RoleLevel
  /** 사용권한값 */
  roleLevelValue?: number
  /** 사용권한명 */
  roleLevelName?: string
  /** 전화번호 */
  phone?: string
  /** 내선번호 */
  extension?: string
  /** 등록단말기(MAC주소) */
  macAddress?: string
  /** 이메일 */
  email?: string
  userStatus?: UserStatus
  /** 사용유무 설명 */
  userStatusDescription?: string
  /** 배정 금융기관 목록 */
  assignedBanks?: AssignedBankInfo[]
}

/** 사용자 응답 */
export interface UserResponse {
  /** 순번 */
  rowNumber?: number
  /** 사용자 ID */
  userId?: number
  /** 지점 ID */
  branchId?: number
  organizationType?: OrganizationType
  /** 기관 구분 설명 */
  organizationTypeDescription?: string
  /** 기관명칭 */
  organizationName?: string
  /** 지점명칭 */
  branchName?: string
  /** 로그인 아이디 */
  loginId?: string
  /** 사용자 이름 */
  name?: string
  roleLevel?: RoleLevel
  /** 사용권한값 */
  roleLevelValue?: number
  /** 사용권한명 */
  roleLevelName?: string
  /** 이메일 인증 여부 */
  isEmailVerified?: boolean
  userStatus?: UserStatus
  /** 사용유무 설명 */
  userStatusDescription?: string
}

/** 내 정보 수정 요청 */
export interface UserSelfUpdateRequest {
  /** 사용자 직책 */
  position: string
  /** 사용자 전화번호 */
  phone: string
  /** 사용자 내선번호 */
  extension?: string
  /** 이메일 */
  email: string
  /** 비밀번호 */
  password?: string
}

/** 사용유무 */
export type UserStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ACTIVE'
  | 'EMAIL_UNVERIFIED'
  | 'TEMPORARY_APPROVAL'
  | 'INACTIVE'
  | 'DELETED'

/** 사용자 정보 수정 요청 */
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
  extension?: string
  /** MAC 주소 */
  macAddress: string
  /** 이메일 */
  email: string
  /** 비밀번호 */
  password?: string
  userStatus: UserStatus
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}
