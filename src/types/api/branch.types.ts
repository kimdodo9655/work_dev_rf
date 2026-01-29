/**
 * BRANCH API Types
 * @generated 2025-01-27
 */

import type {
  BranchAssignedBankItem,
  BranchItem,
  OrganizationType,
  QualifiedType,
  UserAssignedBankItem,
  UserItem
} from './common.types'

/**
 * P02A-01
 * GET /api/branches/search
 */
export interface SearchBranchesQuery {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId?: number
  /** 사용유무 (ACTIVE, INACTIVE, DELETED) */
  branchStatus?: 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'DELETED'
  /** 검색어 (사업자등록번호 또는 자격자성명) */
  keyword?: string
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
}

export type SearchBranchesResponse = BranchResponse

/**
 * P02A-02
 * GET /api/branches/{branchId}
 */
export interface GetBranchParams {
  /** 지점 ID */
  branchId: number
}

export type GetBranchResponse = BranchDetailResponse

/**
 * P02A-03
 * PATCH /api/branches/{branchId}
 */
export interface UpdateBranchParams {
  /** 지점 ID */
  branchId: number
}

export type UpdateBranchRequest = BranchUpdateRequest

export type UpdateBranchResponse = BranchDetailResponse

/**
 * P02A-04
 * POST /api/branches
 */
export type CreateBranchRequest = BranchCreateRequest

export type CreateBranchResponse = BranchCreateResponse

/**
 * P02A-05
 * GET /api/branches/options
 */
export interface GetBranchOptionsQuery {
  /** 기관 ID */
  organizationId: number
}

export type GetBranchOptionsResponse = BranchOptionResponse

/**
 * P02A-06
 * GET /api/branches/check-business-number
 */
export interface CheckBusinessNumberQuery {
  /** 사업자등록번호 */
  businessNumber: string
}

export type CheckBusinessNumberResponse = boolean

// ==================== Schemas ====================

/** 지점 정보 등록 요청 */
export interface BranchCreateRequest {
  /** 기관 ID */
  organizationId: number
  branch: BranchItem
  /** 지점 배정 금융기관 목록 */
  branchAssignedBanks: BranchAssignedBankItem[]
  user: UserItem
  /** MAC 주소 */
  macAddress: string
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
}

/** 지점 정보 등록 응답 */
export interface BranchCreateResponse {
  /** 지점 ID */
  branchId?: number
  /** 지점 명칭 */
  branchName?: string
  /** 사용자 ID */
  userId?: number
  /** 사용자 이름 */
  userName?: string
}

/** 지점 상세 응답 */
export interface BranchDetailResponse {
  /** 지점 ID */
  branchId?: number
  /** 지점 명칭 */
  branchName?: string
  /** 사업자 등록번호 */
  businessRegistrationNumber?: string
  /** 사업장 소재지 */
  address?: string
  /** 사업장 전화번호 */
  phone?: string
  /** 사업장 내선번호 */
  extension?: string
  qualifiedType?: QualifiedType
  /** 자격자 구분 설명 */
  qualifiedTypeDescription?: string
  /** 자격자 성명 */
  qualifiedName?: string
  branchStatus?: BranchStatus
  /** 지점 상태 설명 */
  branchStatusDescription?: string
  /** 사업자등록증 파일명 */
  businessLicenseFileName?: string
  /** 보험가입증명서 파일명 */
  insuranceCertificateFileName?: string
}

/** 지점 옵션 응답 */
export interface BranchOptionResponse {
  /** 지점 ID */
  id?: number
  /** 지점명 */
  branchName?: string
}

/** 지점 응답 */
export interface BranchResponse {
  /** 순번 */
  rowNumber?: number
  /** 지점 ID */
  branchId?: number
  organizationType?: OrganizationType
  /** 기관 구분 설명 */
  organizationTypeDescription?: string
  /** 기관명칭 */
  organizationName?: string
  /** 지점명칭 */
  branchName?: string
  /** 사업자등록번호 */
  businessRegistrationNumber?: string
  qualifiedType?: QualifiedType
  /** 자격자 구분 설명 */
  qualifiedTypeDescription?: string
  /** 자격자 성명 */
  qualifiedName?: string
  branchStatus?: BranchStatus
  /** 지점 상태 설명 */
  branchStatusDescription?: string
}

/** 지점 상태 */
export type BranchStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'DELETED'

/** 지점 정보 수정 요청 */
export interface BranchUpdateRequest {
  /** 사업장 전화번호 */
  phone: string
  /** 사업장 내선번호 */
  extension?: string
  qualifiedType: QualifiedType
  /** 자격자 성명 */
  qualifiedName: string
  branchStatus: BranchStatus
  /** 사업자등록증 파일명 */
  businessLicenseFileName: string
  /** 보험가입증명서 파일명 */
  insuranceCertificateFileName?: string
}
