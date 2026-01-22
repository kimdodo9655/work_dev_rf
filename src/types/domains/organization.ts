/**
 * 기관 관련 타입 정의
 * @file src/types/domains/organization.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 * 수정일: 2025-01-21 (API 문서 기반 재검증)
 */

import type { BranchAssignedBankItem, BranchItem, UserAssignedBankItem } from './branch'
import type { UserItem } from './user'

/**
 * 기관 기본 정보
 * Schema: OrganizationItem
 */
export interface OrganizationItem {
  /** 기관 구분 */
  organizationType: string
  /** 기관 명칭 */
  organizationName: string
  /** 법인 등록번호 */
  corporateRegistrationNumber: string
  /** 대표자 성명 */
  representativeName: string
  /** 본점 소재지 주소 */
  headBranchAddress: string
}

/**
 * 기관 생성 요청
 * Schema: OrganizationCreateRequest
 * API: [P04-01] POST /api/auth/signup
 */
export interface OrganizationCreateRequest {
  /** 기관 정보 */
  organization: OrganizationItem
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
 * 기관 생성 응답
 * Schema: OrganizationCreateResponse
 * API: [P04-01] POST /api/auth/signup
 */
export interface OrganizationCreateResponse {
  /** 기관 ID */
  organizationId: number
  /** 기관명 */
  organizationName: string
}

/**
 * 기관 수정 요청
 * Schema: OrganizationUpdateRequest
 */
export interface OrganizationUpdateRequest {
  /** 기관 구분 */
  organizationType: string
  /** 기관명 */
  organizationName: string
  /** 법인등록번호 */
  corporateRegistrationNumber: string
  /** 대표자명 */
  representativeName: string
  /** 본점 주소 */
  headBranchAddress: string
  /** 기관 상태 */
  organizationStatus: string
}

/**
 * 기관 상세 응답
 * Schema: OrganizationDetailResponse
 * API: [P01-01] GET /api/organizations/{organizationId}
 */
export interface OrganizationDetailResponse {
  /** 기관 ID */
  id: number
  /** 기관 구분 */
  organizationType: string
  /** 기관 구분 설명 */
  organizationTypeDescription: string
  /** 기관명 */
  organizationName: string
  /** 법인등록번호 */
  corporateRegistrationNumber: string
  /** 대표자명 */
  representativeName: string
  /** 본점 주소 */
  headBranchAddress: string
  /** 기관 상태 */
  organizationStatus: string
  /** 기관 상태 설명 */
  organizationStatusDescription: string
}

/**
 * 기관 옵션 응답 (선택 목록용)
 * Schema: OrganizationOptionResponse
 * API: [P01-02] GET /api/organizations/options
 */
export interface OrganizationOption {
  /** 기관 ID */
  id: number
  /** 기관 구분 */
  organizationType: string
  /** 기관 유형 설명 */
  organizationTypeDescription: string
  /** 기관명 */
  organizationName: string
  /** 사용자 소속 기관 여부 */
  belongToOrganization: boolean
}

/**
 * 기관 목록 검색 파라미터
 */
export interface OrganizationSearchParams {
  /** 검색 키워드 */
  keyword?: string
  /** 기관 구분 */
  organizationType?: string
  /** 기관 상태 */
  organizationStatus?: 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'DELETED'
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string
}

/**
 * 기관 목록 파라미터 (별칭)
 */
export type OrganizationListParams = OrganizationSearchParams

/**
 * 법인등록번호 중복 체크 요청
 */
export interface CheckRegistrationNumberParams {
  /** 법인등록번호 */
  corporateRegistrationNumber: string
}

/**
 * 법인등록번호 중복 체크 응답
 */
export interface CheckRegistrationNumberResponse {
  /** 사용 가능 여부 */
  available: boolean
}
