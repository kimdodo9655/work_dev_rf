/**
 * ORGANIZATION API Types
 * @generated 2025-01-27
 */

import type { OrganizationType } from './common.types'

/**
 * P01-01
 * GET /api/organizations/{organizationId}
 */
export interface GetOrganizationParams {
  /** 기관 ID */
  organizationId: number
}

export type GetOrganizationResponse = OrganizationDetailResponse

/**
 * P01-02
 * GET /api/organizations/options
 */
export type GetOrganizationOptionsResponse = OrganizationOptionResponse

/**
 * P01-03
 * GET /api/organizations/check-registration-number
 */
export interface CheckRegistrationNumberQuery {
  /** 법인등록번호 */
  registrationNumber: string
}

export type CheckRegistrationNumberResponse = boolean

// ==================== Schemas ====================

/** 기관 상세 응답 */
export interface OrganizationDetailResponse {
  /** 기관 ID */
  id?: number
  organizationType?: OrganizationType
  /** 기관 구분 설명 */
  organizationTypeDescription?: string
  /** 기관명칭 */
  organizationName?: string
  /** 법인등록번호 */
  corporateRegistrationNumber?: string
  /** 대표자명 */
  representativeName?: string
  /** 본점 주소 */
  headBranchAddress?: string
  organizationStatus?: OrganizationStatus
  /** 기관 상태 설명 */
  organizationStatusDescription?: string
}

/** 기관 옵션 응답 */
export interface OrganizationOptionResponse {
  /** 기관 ID */
  id?: number
  organizationType?: OrganizationType
  /** 기관 유형 설명 */
  organizationTypeDescription?: string
  /** 기관명칭 */
  organizationName?: string
  /** 사용자 소속 기관 여부 */
  belongToOrganization?: boolean
}

/** 사용 유무 */
export type OrganizationStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'DELETED'
