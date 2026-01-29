/**
 * AUTH API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  BranchAssignedBankItem,
  BranchItem,
  OrganizationType,
  UserAssignedBankItem,
  UserItem
} from './common.types'

/**
 * P04-01
 * POST /api/auth/signup
 */
export type SignUpRequest = OrganizationCreateRequest

export type SignUpResponse = OrganizationCreateResponse

/**
 * P04-02
 * POST /api/auth/login
 */
/**
 * P04-03
 * POST /api/auth/logout
 */
export type LogoutResponse = ApiResultVoid

/**
 * P04-04
 * POST /api/auth/refresh
 */
export type RefreshTokenRequest = TokenRefreshRequest

export type RefreshTokenResponse = TokenRefreshResponse

/**
 * P04-05
 * POST /api/auth/email-verify/validate
 */
export type ValidateEmailTokenRequest = EmailVerifyRequest

export type ValidateEmailTokenResponse = EmailVerifyResponse

/**
 * P04-06
 * POST /api/auth/email-verify
 */
export type VerifyEmail_1Request = EmailVerifyRequest

export type VerifyEmail_1Response = ApiResultVoid

/**
 * P04-07
 * POST /api/auth/password
 */
export type SetPasswordResponse = ApiResultVoid

// ==================== Schemas ====================

/** 이메일 인증 요청 */
export interface EmailVerifyRequest {
  /** 사용자 ID */
  userId?: number
  /** 이메일 인증 토큰 */
  token?: string
}

/** 이메일 인증 응답 */
export interface EmailVerifyResponse {
  /** 사용자 ID */
  userId?: number
  /** 사용자 이름 */
  userName?: string
  /** 이메일 주소 */
  email?: string
  /** 토큰 유효성 */
  tokenValid?: boolean
}

/** 로그인 요청 */
export interface LoginRequest {
  /** 로그인 아이디 */
  loginId: string
  /** 비밀번호 */
  password: string
  /** MAC 주소 */
  macAddress?: string
}

/** 로그인 응답 */
export interface LoginResponse {
  /** 액세스 토큰 */
  accessToken?: string
  /** 리프레시 토큰 */
  refreshToken?: string
  /** 로그인 아이디 */
  loginId?: string
  /** 사용자ID */
  userId?: number
  /** 사용자 권한 */
  roleLevel?: number
  /** 액세스 토큰 만료 시간 (초 단위) */
  accessTokenExpiresIn?: number
  /** 리프레시 토큰 만료 시간 (초 단위) */
  refreshTokenExpiresIn?: number
}

/** 기관 정보 등록 요청 */
export interface OrganizationCreateRequest {
  organization: OrganizationItem
  branch: BranchItem
  /** 지점 배정 금융기관 목록 */
  branchAssignedBanks: BranchAssignedBankItem[]
  user: UserItem
  /** MAC 주소 */
  macAddress: string
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}

/** 기관 정보 등록 응답 */
export interface OrganizationCreateResponse {
  /** 기관 ID */
  organizationId?: number
  /** 기관 명칭 */
  organizationName?: string
  /** 지점 ID */
  branchId?: number
  /** 지점 명칭 */
  branchName?: string
  /** 사용자 ID */
  userId?: number
  /** 사용자 이름 */
  userName?: string
}

/** 기관 정보 */
export interface OrganizationItem {
  organizationType: OrganizationType
  /** 기관 명칭 */
  organizationName: string
  /** 법인 등록번호 */
  corporateRegistrationNumber: string
  /** 대표자 성명 */
  representativeName: string
  /** 본점 소재지 주소 */
  headBranchAddress: string
}

/** 비밀번호 설정 요청 */
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

/** 토큰 리프레시 요청 */
export interface TokenRefreshRequest {
  /** 리프레시 토큰 */
  refreshToken: string
}

/** 토큰 리프레시 응답 */
export interface TokenRefreshResponse {
  /** 액세스 토큰 */
  accessToken?: string
  /** 리프레시 토큰 */
  refreshToken?: string
  /** 액세스 토큰 만료 시간 (초 단위) */
  accessTokenExpiresIn?: number
  /** 리프레시 토큰 만료 시간 (초 단위) */
  refreshTokenExpiresIn?: number
}
