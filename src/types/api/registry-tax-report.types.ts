/**
 * REGISTRY_TAX_REPORT API Types
 * @generated 2025-01-27
 */

import type { TaxInfoRequest, TaxInfoResponse } from './common.types'

/**
 * R02P-01
 * GET /api/registry/progress/{registryManagementNumber}/tax-agencies/detail
 */
export interface GetTaxAgenciesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetTaxAgenciesResponse = RegistryProgressTaxAgencyListResponse

/**
 * R02P-02
 * GET /api/registry/progress/{registryManagementNumber}/tax-agencies/list
 */
export interface GetTaxAgencyListParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetTaxAgencyListResponse = RegistryProgressTaxAgencyTableResponse

/**
 * R02P-03
 * PUT /api/registry/progress/{registryManagementNumber}/tax-agencies
 */
export interface ReplaceTaxAgenciesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type ReplaceTaxAgenciesRequest = RegistryProgressTaxAgencyReplaceRequest

export type ReplaceTaxAgenciesResponse = RegistryProgressTaxAgencyListResponse

// ==================== Schemas ====================

/** 세금신고 대행 카드 정보 */
export interface RegistryProgressTaxAgencyItemResponse {
  /** 신청서 ID */
  applicationId?: number
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  taxInfo?: TaxInfoResponse
}

/** 세금신고 대행 목록 응답 */
export interface RegistryProgressTaxAgencyListResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 세금신고 대행 카드 목록 */
  items?: RegistryProgressTaxAgencyItemResponse[]
}

/** 세금신고 대행 목록 대체 요청 */
export interface RegistryProgressTaxAgencyReplaceRequest {
  /** 세금신고 대행 항목 목록 */
  items: RegistryProgressTaxAgencyReplaceRequestItem[]
}

/** 세금신고 대행 항목 */
export interface RegistryProgressTaxAgencyReplaceRequestItem {
  /** 신청서 ID */
  applicationId: number
  tax: TaxInfoRequest
}

/** 세금신고 대행 작업 프로세스 테이블 응답 */
export interface RegistryProgressTaxAgencyTableResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 세금신고 대행 테이블 행 목록 */
  rows?: Row[]
}

/** 세금신고 대행 테이블 행 정보 */
export interface Row {
  /** 신청서 ID */
  applicationId?: number
  /** 등기유형 명 */
  registryTypeName?: string
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  /** 납부 상태 명 */
  paymentStatusName?: string
  /** 납부 금액 */
  paymentAmount?: number
  /** 납세 번호 */
  taxNumber?: string
  /** 전자납부 번호 */
  electronicPaymentNumber?: string
}
