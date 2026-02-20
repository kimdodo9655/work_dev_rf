/**
 * REGISTRY_TAX API Types
 * @generated 2025-01-27
 */

import type { FilingFeeRequest, TaxInfoRequest } from './common.types'

/**
 * R02I-01
 * GET /api/registry/applications/{applicationId}/ownership/tax/detail
 */
export interface GetTaxInfoParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetTaxInfoResponse = TaxPopupResponse

/**
 * R02I-02
 * POST /api/registry/applications/{applicationId}/ownership/tax
 */
export interface SaveTaxInfoParams {
  /** 신청서 ID */
  applicationId: number
}

export type SaveTaxInfoRequest = OwnershipTaxRequest

export type SaveTaxInfoResponse = TaxPopupResponse

// ==================== Schemas ====================

/** 세금정보 및 등기신청수수료 */
export interface OwnershipTaxRequest {
  tax: TaxInfoRequest
  filingFee: FilingFeeRequest
}

/** 세금 조회 팝업 응답 */
export interface TaxPopupResponse {
  taxBase?: TaxBaseSection
  tax?: RegistryTaxSection
  filingFee?: FilingFeeSection
}

/** 과세표준 정보 */
export interface TaxBaseSection {
  /** 과세표준 합계 */
  totalTaxBaseAmount?: number
  /** 부동산별 과세표준 항목 */
  properties?: TaxBaseItem[]
}

/** 부동산별 과세표준 항목 */
export interface TaxBaseItem {
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 부동산 주소 */
  propertyAddress?: string
  /** 공시지가 */
  officialLandPrice?: number
  /** 면적 */
  area?: number
  /** 과세표준액 */
  taxBaseAmount?: number
}

/** 세금 정보 섹션 */
export interface RegistryTaxSection {
  /** 납부 여부 */
  paymentStatus?: string
  /** 감면 사유 */
  exemptionReason?: string
  /** 등록면허세 */
  registrationLicenseTax?: number
  /** 지방교육세 */
  educationTax?: number
  /** 농어촌특별세 */
  ruralSpecialTax?: number
  /** 합계 */
  totalAmount?: number
}

/** 등기신청수수료 섹션 */
export interface FilingFeeSection {
  /** 납부 여부 */
  paymentStatus?: string
  /** 감면 사유 */
  exemptionReason?: string
  /** 등기 유형 */
  registryType?: string
  /** 등기 방식 */
  registryMethod?: string
  /** 등기 건수 */
  registryCount?: number
  /** 신청 수수료 */
  applicationFee?: number
}
