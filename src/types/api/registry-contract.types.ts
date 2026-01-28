/**
 * REGISTRY_CONTRACT API Types
 * @generated 2025-01-27
 */

import type { ContractPartyResponse, RegistryApplicationPartyReplaceRequest } from './common.types'

/**
 * R02E-01
 * GET /api/registry/applications/{applicationId}/contracts/parties
 */
export interface GetContractPartiesParams {
  /** 신청서ID */
  applicationId: number
}

export type GetContractPartiesResponse = ContractPartyResponse

/**
 * R02E-02
 * PUT /api/registry/applications/{applicationId}/contracts/parties
 */
export interface ReplaceContractPartiesParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceContractPartiesRequest = RegistryApplicationPartyReplaceRequest

export type ReplaceContractPartiesResponse = ApiResultContractPartyResponse

/**
 * R02E-03
 * GET /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface GetOwnershipContractParams {
  /** 신청서ID */
  applicationId: number
}

export type GetOwnershipContractResponse = OwnershipContractResponse

/**
 * R02E-04
 * PUT /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface SaveOwnershipContractParams {
  /** 신청서ID */
  applicationId: number
}

export type SaveOwnershipContractRequest = OwnershipContractRequest

export type SaveOwnershipContractResponse = ApiResultOwnershipContractResponse

/**
 * R02E-05
 * GET /api/registry/applications/{applicationId}/contracts/mortgage
 */
export interface GetMortgageContractParams {
  /** 신청서ID */
  applicationId: number
}

export type GetMortgageContractResponse = MortgageContractResponse

/**
 * R02E-06
 * PUT /api/registry/applications/{applicationId}/contracts/mortgage
 */
export interface SaveMortgageContractParams {
  /** 신청서ID */
  applicationId: number
}

export type SaveMortgageContractRequest = MortgageContractRequest

export type SaveMortgageContractResponse = ApiResultMortgageContractResponse

/**
 * R02E-07
 * GET /api/registry/applications/{applicationId}/contracts/surface-right
 */
export interface GetSurfaceRightContractParams {
  /** 신청서ID */
  applicationId: number
}

export type GetSurfaceRightContractResponse = SurfaceRightContractResponse

/**
 * R02E-08
 * PUT /api/registry/applications/{applicationId}/contracts/surface-right
 */
export interface SaveSurfaceRightContractParams {
  /** 신청서ID */
  applicationId: number
}

export type SaveSurfaceRightContractRequest = SurfaceRightContractRequest

export type SaveSurfaceRightContractResponse = ApiResultSurfaceRightContractResponse

// ==================== Schemas ====================

export interface ApiResultContractPartyResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: ContractPartyResponse
}

export interface ApiResultMortgageContractResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: MortgageContractResponse
}

export interface ApiResultOwnershipContractResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: OwnershipContractResponse
}

export interface ApiResultSurfaceRightContractResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: SurfaceRightContractResponse
}

/** 2차 중도금 정보 */
export interface InterimPayment {
  /** 중도금액 */
  amount?: number
  /** 중도금 일자 */
  date?: string
}

/** 2차 중도금 정보 */
export interface InterimPaymentResponse {
  amount?: number
  date?: string
}

export interface MortgageContractRequest {
  /** 채권 최고액 */
  maximumCreditAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 대출 실행 일자 */
  loanExecutionDate?: string
  /** 피담보채무 범위 유형 */
  securedDebtScopeType?: 'LIMITED' | 'SPECIFIC'
  /** 피담보채무 범위 목록 (최대 2건) */
  securedDebtScopes?: SecuredDebtScopeRequest[]
  /** 결산기 유형 */
  settlementPeriodType?: string
  /** 결산 일자 */
  settlementDate?: string
  /** 철회권 포기 여부 */
  isWithdrawalRightWaived?: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
}

export interface MortgageContractResponse {
  /** 채권 최고액 */
  maximumCreditAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 대출 실행 일자 */
  loanExecutionDate?: string
  /** 피담보채무 범위 구분 */
  securedDebtScopeType?: 'LIMITED' | 'SPECIFIC'
  /** 피담보채무 범위 상세 */
  securedDebtScopes?: SecuredDebtScopeResponse[]
  /** 결산기 유형 */
  settlementPeriodType?: string
  /** 결산 일자 */
  settlementDate?: string
  /** 철회권 포기 여부 */
  isWithdrawalRightWaived?: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
}

export interface OwnershipContractRequest {
  /** 계약 금액 */
  contractAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  firstInterim?: InterimPayment
  secondInterim?: InterimPayment
}

export interface OwnershipContractResponse {
  /** 계약 금액 */
  contractAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  firstInterim?: InterimPaymentResponse
  secondInterim?: InterimPaymentResponse
}

/** 피담보채무 범위 목록 (최대 2건) */
export interface SecuredDebtScopeRequest {
  /** 피담보채무 범위 ID (수정 시 필수) */
  securedDebtScopeId?: number
  /** 거래 일자 (특정근담보) */
  transactionDate?: string
  /** 약정서명 (특정근담보) */
  agreementName?: string
  /** 거래 종류 (한정근담보) */
  transactionType?: string
}

/** 피담보채무 범위 상세 */
export interface SecuredDebtScopeResponse {
  securedDebtScopeId?: number
  securedDebtScopeType?: 'LIMITED' | 'SPECIFIC'
  transactionType?: string
  transactionDate?: string
  agreementName?: string
}

export interface SurfaceRightContractRequest {
  /** 존속 기간 */
  durationPeriod?: string
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 설정 범위 */
  establishmentScope?: string
  /** 설정 목적 */
  establishmentPurpose?: string
  /** 의무자 계약당사자 ID */
  obligorPartyId?: number
  /** 권리자 계약당사자 ID */
  obligeePartyId?: number
}

export interface SurfaceRightContractResponse {
  /** 존속 기간 */
  durationPeriod?: string
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 설정 범위 */
  establishmentScope?: string
  /** 설정 목적 */
  establishmentPurpose?: string
  /** 의무자 계약당사자 ID */
  obligorPartyId?: number
  /** 권리자 계약당사자 ID */
  obligeePartyId?: number
  /** 지상권 관련 당사자 옵션 */
  partyOptions?: SurfaceRightPartyOption[]
}

/** 지상권 관련 당사자 옵션 */
export interface SurfaceRightPartyOption {
  partyId?: number
  progressPartyId?: number
  name?: string
  address?: string
}
