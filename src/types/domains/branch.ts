/**
 * 지점 관련 타입 정의
 * @file src/types/domains/branch.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 * 수정일: 2025-01-21 (API 문서 기반 재검증)
 */

import type { UserItem } from './user'

/**
 * 등기 유형 (배정용)
 * Schema: RegistryTypeForAssign
 */
export type RegistryTypeForAssign = 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'

/**
 * 지점 배정 금융기관
 * Schema: BranchAssignedBankItem
 *
 * 중요: 한 금융기관에 여러 등기 유형을 배정하려면 여러 항목을 만들어야 합니다.
 * 예: [{registryType: 'OWNERSHIP_TRANSFER', bankCode: 'kb'},
 *      {registryType: 'MORTGAGE_REGISTRATION', bankCode: 'kb'}]
 */
export interface BranchAssignedBankItem {
  /** 등기 유형 */
  registryType: RegistryTypeForAssign
  /** 금융기관 코드 */
  bankCode: string
}

/**
 * 사용자 배정 금융기관
 * Schema: UserAssignedBankItem
 *
 * 중요: 한 금융기관에 여러 등기 유형을 배정하려면 여러 항목을 만들어야 합니다.
 */
export interface UserAssignedBankItem {
  /** 등기 유형 */
  registryType: RegistryTypeForAssign
  /** 금융기관 코드 */
  bankCode: string
}

/**
 * 배정 금융기관 정보 (응답용)
 * Schema: AssignedBankInfo
 */
export interface AssignedBankInfo {
  /** 등기 유형 */
  registryType: RegistryTypeForAssign
  /** 금융기관 코드 */
  bankCode: string
  /** 금융기관명 */
  bankName: string
}

/**
 * 지점 기본 정보
 * Schema: BranchItem
 */
export interface BranchItem {
  /** 지점 명칭 */
  branchName: string
  /** 사업자 등록번호 */
  businessRegistrationNumber: string
  /** 사업장 전화번호 */
  phone: string
  /** 사업장 내선번호 */
  extension: string
  /** 사업장 소재지 */
  address: string
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 사업자등록증 파일명 */
  businessLicenseFileName: string
  /** 보험가입증명서 파일명 */
  insuranceCertificateFileName: string
}

/**
 * 지점 생성 요청
 * Schema: BranchCreateRequest
 * API: [P02A-04] POST /api/branches
 */
export interface BranchCreateRequest {
  /** 기관 ID */
  organizationId: number
  /** 지점 정보 */
  branch: BranchItem
  /** 사용자 정보 */
  user: UserItem
  /** 지점 배정 금융기관 목록 */
  branchAssignedBanks: BranchAssignedBankItem[]
  /** 사용자 배정 금융기관 목록 */
  userAssignedBanks: UserAssignedBankItem[]
  /** MAC 주소 */
  macAddress: string
}

/**
 * 지점 생성 응답
 * Schema: BranchCreateResponse
 * API: [P02A-04] POST /api/branches
 */
export interface BranchCreateResponse {
  /** 지점 ID */
  branchId: number
  /** 지점명 */
  branchName: string
}

/**
 * 지점 수정 요청
 * Schema: BranchUpdateRequest
 * API: [P02A-03] PATCH /api/branches/{branchId}
 *
 * 주의: branchName, businessRegistrationNumber, address는 수정 불가
 */
export interface BranchUpdateRequest {
  /** 사업장 전화번호 */
  phone: string
  /** 사업장 내선번호 */
  extension: string
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 지점 상태 */
  branchStatus: string
  /** 사업자등록증 파일명 */
  businessLicenseFileName: string
  /** 보험가입증명서 파일명 */
  insuranceCertificateFileName: string
}

/**
 * 지점 상세 응답
 * Schema: BranchDetailResponse
 * API: [P02A-02] GET /api/branches/{branchId}
 */
export interface BranchDetailResponse {
  /** 지점 ID */
  branchId: number
  /** 지점명 */
  branchName: string
  /** 사업자 등록번호 */
  businessRegistrationNumber: string
  /** 사업장 소재지 */
  address: string
  /** 사업장 전화번호 */
  phone: string
  /** 사업장 내선번호 */
  extension: string
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 구분 설명 */
  qualifiedTypeDescription: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 지점 상태 */
  branchStatus: string
  /** 지점 상태 설명 */
  branchStatusDescription: string
  /** 사업자등록증 파일명 */
  businessLicenseFileName: string
  /** 보험가입증명서 파일명 */
  insuranceCertificateFileName: string
}

/**
 * 지점 검색 응답 (목록)
 * Schema: BranchResponse
 * API: [P02A-01] GET /api/branches/search
 */
export interface BranchListItem {
  /** 순번 */
  rowNumber: number
  /** 지점 ID */
  branchId: number
  /** 기관 구분 */
  organizationType: string
  /** 기관 구분 설명 */
  organizationTypeDescription: string
  /** 기관명 */
  organizationName: string
  /** 지점명 */
  branchName: string
  /** 사업자 등록번호 */
  businessRegistrationNumber: string
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 구분 설명 */
  qualifiedTypeDescription: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 지점 상태 */
  branchStatus: string
  /** 지점 상태 설명 */
  branchStatusDescription: string
}

/**
 * 지점 옵션 응답 (선택 목록용)
 * Schema: BranchOptionResponse
 * API: [P02A-05] GET /api/branches/options
 */
export interface BranchOption {
  /** 지점 ID */
  id: number
  /** 지점명 */
  branchName: string
}

/**
 * 지점 배정 금융기관 목록 응답
 * Schema: BranchAssignedBankResponse
 * API: [P02B-01] GET /api/branches/{branchId}/assigned-banks
 */
export interface BranchAssignedBankResponse {
  /** 등기 유형 */
  registryType: RegistryTypeForAssign
  /** 등기 유형 설명 */
  registryTypeDescription: string
  /** 금융기관 코드 */
  bankCode: string
  /** 금융기관명 */
  bankName: string
}

/**
 * 지점 지급계좌 정보
 * Schema: BranchPaymentAccountResponse
 * API: [P02C-01] GET /api/branches/{branchId}/payment-accounts
 */
export interface BranchPaymentAccount {
  /** 지점 ID */
  branchId: number
  /** 지급계좌 구분 */
  accountType: string
  /** 지급계좌 구분 설명 */
  accountTypeDescription: string
  /** 지급 금융기관명 */
  bankName: string
  /** 지급 계좌번호 */
  accountNumber: string
  /** 예금주명 */
  accountHolder: string
}

/**
 * 지점 인터넷등기소 계정 정보
 * Schema: BranchRegistryCredentialResponse
 * API: [P02D-01] GET /api/branches/{branchId}/registry-credentials
 */
export interface BranchRegistryCredential {
  /** 지점 인터넷등기소 아이디 고유번호 */
  credentialId: number
  /** 지점 ID */
  branchId: number
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 구분 설명 */
  qualifiedTypeDescription: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 인터넷등기소 로그인 아이디 */
  registryLoginId: string
  /** 인터넷등기소 로그인 비밀번호 */
  registryPassword: string
}

/**
 * 지점 검색 파라미터
 */
export interface BranchSearchParams {
  /** 기관 ID (필수) */
  organizationId: number
  /** 지점 ID */
  branchId?: number
  /** 지점 상태 */
  branchStatus?: 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'DELETED'
  /** 검색 키워드 (사업자등록번호 또는 자격자성명) */
  keyword?: string
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string
}

/**
 * 지점 목록 파라미터 (별칭)
 */
export type BranchListParams = BranchSearchParams

/**
 * 사업자등록번호 중복 체크 요청
 */
export interface CheckBusinessNumberParams {
  /** 사업자등록번호 */
  businessRegistrationNumber: string
}

/**
 * 사업자등록번호 중복 체크 응답
 */
export interface CheckBusinessNumberResponse {
  /** 사용 가능 여부 */
  available: boolean
}

// 하위 호환성을 위한 별칭 (deprecated)
/** @deprecated BranchAssignedBankItem을 사용하세요 */
export type BranchAssignedBank = BranchAssignedBankItem
/** @deprecated UserAssignedBankItem을 사용하세요 */
export type UserAssignedBank = UserAssignedBankItem
