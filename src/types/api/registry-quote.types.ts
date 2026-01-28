/**
 * REGISTRY_QUOTE API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid, ObligorInfo, PropertyInfo, RegistryMethod } from './common.types'

/**
 * R01-01
 * GET /api/registry/estimates
 */
export interface GetEstimateListQuery {
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 필지 (1-20, '전체' 또는 ALL 입력 시 전체 검색) */
  plotCount?: string | null
  /** 등기의뢰일자 시작일 */
  requestDateFrom?: string
  /** 등기의뢰일자 종료일 */
  requestDateTo?: string
  /** 등기접수일자 시작일 */
  receiptDateFrom?: string
  /** 등기접수일자 종료일 */
  receiptDateTo?: string
  /** 진행상태 */
  progressStatus?:
    | 'QUOTE_IN_PROGRESS'
    | 'QUOTE_CLOSED'
    | 'ESTIMATE_SELECTED'
    | 'SELECTION_COMPLETED'
    | 'REQUEST_CANCELLED'
  /** 작성여부 */
  writingStatus?: 'WAITING' | 'COMPLETED' | 'WITHDRAWN'
  /** 선정여부 */
  selectionStatus?: 'WAITING' | 'SELECTED' | 'NOT_SELECTED'
  /** 통합검색 (부동산 주소 또는 등기신청번호) */
  keyword?: string
  /** 페이지 번호 (1부터 시작) */
  page?: number
  /** 페이지 크기 */
  size?: number
}

export type GetEstimateListResponse = EstimateListItemResponse

/**
 * R01-02
 * GET /api/registry/estimates/requests/{registryRequestNumber}/info
 */
export interface GetEstimateInfoByRegistryRequestNumberParams {
  /** 등기의뢰번호 */
  registryRequestNumber: string
}

export type GetEstimateInfoByRegistryRequestNumberResponse = EstimateInfoResponse

/**
 * R01-03
 * GET /api/registry/estimates/{estimateId}/details
 */
export interface GetEstimateDetailParams {
  /** 견적서 ID */
  estimateId: number
}

export type GetEstimateDetailResponse = EstimateDetailResponse

/**
 * R01-04
 * POST /api/registry/estimates/requests/{registryRequestNumber}/submit
 */
export interface SubmitEstimateParams {
  /** 등기신청번호 */
  registryRequestNumber: string
}

export type SubmitEstimateRequest = EstimateSubmitRequest

export type SubmitEstimateResponse = EstimateSubmitResponse

/**
 * R01-05
 * DELETE /api/registry/estimates/{estimateId}
 */
export interface WithdrawEstimateParams {
  /** 견적서 ID */
  estimateId: number
}

export type WithdrawEstimateResponse = ApiResultVoid

// ==================== Schemas ====================

/** 견적 상세 정보 */
export interface EstimateDetailResponse {
  /** 견적서 ID */
  estimateId?: number
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 기관 ID */
  organizationId?: number
  /** 지점 ID */
  branchId?: number
  /** 등기 진행 방식 */
  registryMethod?: string
  feeDetails?: FeeDetails
  publicChargeDetails?: PublicChargeDetails
  legalAgentInfo?: LegalAgentInfo
  /** 선정 일시 */
  selectedAt?: string
  /** 생성일시 */
  createdAt?: string
  /** 수정일시 */
  updatedAt?: string
}

/** 견적 기본 정보 */
export interface EstimateInfoResponse {
  registryInfo?: RegistryInfo
  propertyInfo?: PropertyInfo
  obligorInfo?: ObligorInfo
  obligeeInfo?: ObligeeInfo
}

/** 등기 견적 관리 목록 아이템 */
export interface EstimateListItemResponse {
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 등기유형 */
  registryType?: string
  /** 매매금액 */
  tradeAmount?: number
  /** 부동산 주소 */
  propertyAddress?: string
  /** 필지 수 */
  plotCount?: number
  /** 등기의뢰일자 */
  requestDate?: string
  /** 등기접수일자 */
  receiptDate?: string
  /** 진행상태 */
  progressStatus?: string
  /** 작성여부 */
  writingStatus?: string
  /** 선정여부 */
  selectionStatus?: string
  /** 견적서 ID (작성 완료된 경우) */
  estimateId?: number
  /** 생성일시 */
  createdAt?: string
}

/** 견적서 제출 요청 */
export interface EstimateSubmitRequest {
  registryMethod: RegistryMethod
  /** 기본 보수 */
  baseFee: number
  /** 가산 보수 */
  additionalFee?: number
  /** 제증명 비용 */
  certificateFee?: number
  /** 등기원인증서 작성 비용 */
  registryCauseDocumentFee?: number
  /** 공과금 신고/납부 대행 비용 */
  taxPaymentAgencyFee?: number
  /** 국민주택채권 즉시매도 대행 비용 */
  bondSaleAgencyFee?: number
  /** 검인/부동산거래신고 대행 비용 */
  inspectionTradeReportAgencyFee?: number
  /** 실비변상 (교통비/숙박비/일당) */
  actualCost?: number
  /** 확인서면 비용 */
  confirmationDocumentFee?: number
  /** 기타 비용 */
  otherFee?: number
  /** 부가가치세 */
  vat?: number
  /** 취득세 */
  acquisitionTax: number
  /** 등록면허세 */
  registrationLicenseTax?: number
  /** 교육세 */
  educationTax?: number
  /** 농어촌특별세 */
  ruralSpecialTax?: number
  /** 인지세 */
  stampTax?: number
  /** 등기신청수수료 */
  registryApplicationFee?: number
}

/** 견적서 제출 응답 */
export interface EstimateSubmitResponse {
  /** 견적서 ID */
  estimateId?: number
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 기관 ID */
  organizationId?: number
  /** 지점 ID */
  branchId?: number
  /** 등기 진행 방식 */
  registryMethod?: string
  /** 보수료 합계 */
  totalFee?: number
  /** 공과금 합계 */
  totalTax?: number
  /** 생성일시 */
  createdAt?: string
}

/** 견적서 보수료 상세 */
export interface FeeDetails {
  baseFee?: number
  additionalFee?: number
  certificateFee?: number
  registryCauseDocumentFee?: number
  taxPaymentAgencyFee?: number
  bondSaleAgencyFee?: number
  inspectionTradeReportAgencyFee?: number
  actualCost?: number
  confirmationDocumentFee?: number
  otherFee?: number
  vat?: number
  totalFee?: number
}

/** 법무대리인 정보 */
export interface LegalAgentInfo {
  organizationName?: string
  branchName?: string
  estimatorName?: string
  branchAddress?: string
}

/** 등기권리자 정보 */
export interface ObligeeInfo {
  /** 등기권리자 수 */
  obligeeCount?: number
  /** 특이사항 */
  specialNote?: string
  esignatureStatus?: string
}

/** 견적서 공과금 상세 */
export interface PublicChargeDetails {
  acquisitionTax?: number
  registrationLicenseTax?: number
  educationTax?: number
  ruralSpecialTax?: number
  stampTax?: number
  registryApplicationFee?: number
  totalTax?: number
}

/** 등기 기본 정보 */
export interface RegistryInfo {
  /** 등기유형 */
  workTypeDescription?: string
  /** 매매금액 */
  tradeAmount?: number
  /** 접수일자 */
  receiptDate?: string
}
