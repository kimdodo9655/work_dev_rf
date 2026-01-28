/**
 * REGISTRY_TAX API Types
 * @generated 2025-01-27
 */

import type {
  FilingFeeRequest,
  FilingFeeResponse,
  TaxInfoRequest,
  TaxInfoResponse
} from './common.types'

/**
 * R02I-01
 * GET /api/registry/applications/{applicationId}/ownership/tax/detail
 */
export interface GetTaxInfoParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetTaxInfoResponse = OwnershipTaxResponse

/**
 * R02I-02
 * POST /api/registry/applications/{applicationId}/ownership/tax
 */
export interface SaveTaxInfoParams {
  /** 신청서 ID */
  applicationId: number
}

export type SaveTaxInfoRequest = OwnershipTaxRequest

export type SaveTaxInfoResponse = OwnershipTaxResponse

// ==================== Schemas ====================

/** 세금정보 및 등기신청수수료 */
export interface OwnershipTaxRequest {
  tax: TaxInfoRequest
  filingFee: FilingFeeRequest
}

/** 세금정보 + 등기신청수수료 통합 응답 */
export interface OwnershipTaxResponse {
  tax?: TaxInfoResponse
  filingFee?: FilingFeeResponse
}
