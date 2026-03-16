/**
 * 문서 경로: `@/src/types/api/registry-contract.types.ts`
 * 문서 제목: 타입 정의: registry-contract-types
 */

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

export type ReplaceContractPartiesResponse = ApiResultContractPartyReplaceResponse

/**
 * R02E-03
 * GET /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface GetOwnershipContractParams {
  /** 신청서ID */
  applicationId: number
}

export type GetOwnershipContractResponse = OwnershipContractViewResponse

/**
 * R02E-04
 * PUT /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface SaveOwnershipContractParams {
  /** 신청서ID */
  applicationId: number
}

export type SaveOwnershipContractRequest = OwnershipContractRequest

export type SaveOwnershipContractResponse = ApiResultOwnershipContractSaveResponse

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

export type SaveMortgageContractResponse = ApiResultMortgageContractSaveResponse

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

export type SaveSurfaceRightContractResponse = ApiResultSurfaceRightContractSaveResponse

// ==================== Schemas ====================

export interface ApiResultContractPartyReplaceResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: ContractPartyReplaceResponse
}

export interface ApiResultMortgageContractSaveResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: MortgageContractSaveResponse
}

export interface ApiResultOwnershipContractSaveResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: OwnershipContractSaveResponse
}

export interface ApiResultSurfaceRightContractSaveResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: SurfaceRightContractSaveResponse
}

export interface CommonParty {
  /** 성명 */
  name?: string
  /** 등록번호 */
  registrationNumber?: string
  /** 주소 */
  address?: string
  /** 지분 */
  share?: string
}

export interface DebtorInfo {
  /** 성명 */
  name?: string
  /** 주소 */
  address?: string
  /** 상세주소 */
  addressDetail?: string
}

export interface PartyShareResponse {
  progressPartyId?: number
  name?: string
  registrationNumber?: string
  address?: string
  addressDetail?: string
  share?: string
  holdingShare?: string
  transferShare?: string
  section?: string
  rankNumber?: string
}

export interface RegistryCertificateFormResponse {
  propertyUniqueNumber?: string
  ownerName?: string
  certificateSerialNumber?: string
  certificatePassword?: string
}

export interface ContractPartyReplaceResponse {
  /** 등기의무자 목록 */
  obligors?: CommonParty[]
  /** 등기권리자 목록 */
  obligees?: CommonParty[]
  /** 채무자 목록 */
  debtors?: DebtorInfo[]
  shareDescription?: string
  obligorsWithShare?: PartyShareResponse[]
  obligeesWithShare?: PartyShareResponse[]
  registryCertificates?: RegistryCertificateFormResponse[]
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
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
  /** 채권 최고액 */
  maximumCreditAmount?: number
  /** 대출금액 */
  loanAmount?: number
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
  /** 대면 여부 */
  isFaceToFace?: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
}

export interface MortgageContractResponse {
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
    | 'NAME_CHANGE'
    | 'REGISTRATION_NUMBER'
  /** 채권 최고액 */
  maximumCreditAmount?: number
  /** 대출금액 */
  loanAmount?: number
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
  /** 대면 여부 */
  isFaceToFace?: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
}

export interface MortgageContractSaveResponse {
  /** 채권 최고액 */
  maximumCreditAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
}

export interface OwnershipContractRequest {
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
  /** 계약 금액 */
  contractAmount?: number
  /** 매매금액 */
  tradeAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  /** 잔금지급일 */
  balancePaymentDate?: string
  firstInterim?: InterimPayment
  secondInterim?: InterimPayment
}

export interface OwnershipContractResponse {
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
    | 'NAME_CHANGE'
    | 'REGISTRATION_NUMBER'
  /** 계약 금액 */
  contractAmount?: number
  /** 매매금액 */
  tradeAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  /** 잔금지급일 */
  balancePaymentDate?: string
  firstInterim?: InterimPaymentResponse
  secondInterim?: InterimPaymentResponse
}

export type OwnershipContractViewResponse = OwnershipContractResponse

export interface OwnershipContractSaveResponse {
  /** 계약 금액 */
  contractAmount?: number
  /** 계약 일자 */
  contractDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
  /** 등록 목적 */
  registrationPurpose?: string
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
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
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
}

export interface SurfaceRightContractResponse {
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
    | 'NAME_CHANGE'
    | 'REGISTRATION_NUMBER'
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
}

export interface SurfaceRightContractSaveResponse {
  /** 존속 기간 */
  durationPeriod?: string
  /** 계약 일자 */
  contractDate?: string
  /** 설정 범위 */
  establishmentScope?: string
  /** 설정 목적 */
  establishmentPurpose?: string
}
