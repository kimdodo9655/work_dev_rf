/**
 * REGISTRY_DEBT_TAX API Types
 * @generated 2025-01-27
 */

import type {
  BondPropertyItemResponse,
  BondSectionRequest,
  FilingFeeRequest,
  FilingFeeResponse,
  HousingBondResponse,
  TaxInfoRequest,
  TaxInfoResponse
} from './common.types'

/**
 * R02H-01
 * GET /api/registry/applications/{applicationId}/mortgage/financial
 */
export interface GetParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetResponse = MortgageFinancialResponse

/**
 * R02H-02
 * POST /api/registry/applications/{applicationId}/mortgage/financial
 */
export interface ReplaceParams {
  /** 신청서 ID */
  applicationId: number
}

export type ReplaceRequest = MortgageFinancialRequest

export type ReplaceResponse = MortgageFinancialResponse

// ==================== Schemas ====================

/** 국민주택채권 응답 */
export interface BondSectionResponse {
  application?: HousingBondResponse
  /** 부동산별 국민주택채권 목록 */
  properties?: BondPropertyItemResponse[]
}

/** 채권 및 세금정보 통합 저장 요청 */
export interface MortgageFinancialRequest {
  bond?: BondSectionRequest
  tax?: TaxInfoRequest
  stamp?: StampTaxRequest
  filingFee?: FilingFeeRequest
}

/** 채권 및 세금정보 통합 조회 응답 */
export interface MortgageFinancialResponse {
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
  bond?: BondSectionResponse
  tax?: TaxInfoResponse
  stamp?: StampTaxResponse
  filingFee?: FilingFeeResponse
}

/** 인지세 신고 정보 저장 요청 */
export interface StampTaxRequest {
  /** 납부 여부 */
  paymentStatus: 'PAYMENT' | 'EXEMPTION'
  /** 면제 사유 */
  exemptionReason?: string
  /** 납부자 이름 */
  name: string
  /** (주민)등록번호 */
  registrationNumber: string
  /** 연락처 */
  contact: string
  /** 이메일 */
  email: string
  /** 계약일자 */
  contractDate: string
  /** 매매금액 */
  tradeAmount?: number
  /** 인지세액 */
  stampTaxAmount?: number
}

/** 인지세 신고 정보 응답 */
export interface StampTaxResponse {
  /** 신청서 ID */
  applicationId?: number
  /** 납부 여부 */
  paymentStatus?: 'PAYMENT' | 'EXEMPTION'
  /** 면제 사유 */
  exemptionReason?: string
  /** 이름/명칭 */
  name?: string
  /** (주민)등록번호 */
  registrationNumber?: string
  /** 연락처 */
  contact?: string
  /** 이메일 */
  email?: string
  /** 계약일자 */
  contractDate?: string
  /** 매매금액 */
  tradeAmount?: number
  /** 인지세액 */
  stampTaxAmount?: number
}
