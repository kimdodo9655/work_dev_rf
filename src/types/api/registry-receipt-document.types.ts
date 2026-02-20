/**
 * REGISTRY_RECEIPT_DOCUMENT API Types
 * @generated 2025-01-27
 */

import type { DocumentDownloadBase64Response } from './common.types'

/**
 * R02W-01
 * GET /api/registry/progress/{registryManagementNumber}/receipt-documents/list
 */
export interface GetReceiptDocumentsParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetReceiptDocumentsResponse = ReceiptDocumentListResponse

/**
 * R02W-02
 * GET /api/registry/progress/{registryManagementNumber}/receipt-documents/detail
 */
export interface GetReceiptDocumentDetailsParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetReceiptDocumentDetailsResponse = ReceiptDocumentDetailResponse

/**
 * R02W-05
 * GET /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document
 */
export interface DownloadReceiptDocumentQuery {
  /** 파일명 */
  fileName?: string
}

export interface DownloadReceiptDocumentParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 영수증ID */
  receiptDocumentId: number
}

export type DownloadReceiptDocumentResponse = DocumentDownloadBase64Response

/**
 * R02W-03
 * POST /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document
 */
export interface GenerateReceiptDocumentParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 영수증ID */
  receiptDocumentId: number
}

export type GenerateReceiptDocumentResponse = ApiResult

/**
 * R02W-04
 * DELETE /api/registry/progress/{registryManagementNumber}/receipt-documents/{receiptDocumentId}/document
 */
export interface DeleteReceiptDocumentParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 영수증ID */
  receiptDocumentId: number
}

export type DeleteReceiptDocumentResponse = ApiResult

/**
 * R02W-06
 * GET /api/registry/progress/{registryManagementNumber}/receipt-documents/detail/form
 */
export interface GetReceiptDocumentFormQuery {
  /** 영수증ID */
  receiptDocumentId?: number
}

export interface GetReceiptDocumentFormParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetReceiptDocumentFormResponse = ReceiptDocumentFormResponse

/**
 * R02W-07
 * PUT /api/registry/progress/{registryManagementNumber}/receipt-documents
 */
export interface SaveReceiptDocumentsParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type SaveReceiptDocumentsRequest = ReceiptDocumentSaveRequest

export type SaveReceiptDocumentsResponse = ApiResult

// ==================== Schemas ====================

export interface ApiResult {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: Record<string, any>
}

/** 국민주택채권 정보 */
export interface BondSection {
  bondPurchaseAmount?: number
  housingBondDiscountAmount?: number
}

/** 사업자/입금계좌 정보 */
export interface BusinessSection {
  businessRegistrationNumber?: string
  officeAddress?: string
  businessName?: string
  representative?: string
  branchPaymentAccountId?: number
  depositAccountLabel?: string
}

/** 보수료 정보 */
export interface FeeSection {
  baseFee?: number
  additionalFee?: number
  certificateFee?: number
  registryCauseDocumentFee?: number
  taxPaymentAgencyFee?: number
  bondSaleAgencyFee?: number
  inspectionTradeReportAgencyFee?: number
  confirmationDocumentFee?: number
  actualCost?: number
  otherFee?: number
  vat?: number
}

/** 영수증 상세 항목 */
export interface ReceiptDetailItem {
  /** 영수증ID */
  receiptDocumentId?: number
  /** 등기유형명 */
  registryTypeName?: string
  /** 보수료 소계 */
  feeSubtotal?: number
  /** 공과금 소계 */
  taxSubtotal?: number
  /** 채권 할인금액 */
  bondDiscountAmount?: number
  /** 등기비용 합계 */
  costTotal?: number
  /** 등기수수료 지급계좌 레이블 (계좌번호 / 금융기관명) */
  depositAccountLabel?: string
  /** 전자문서 생성 여부 */
  documentGenerated?: boolean
  /** PDF 파일명 */
  fileName?: string
}

/** 등기 영수증 상세 목록 응답 */
export interface ReceiptDocumentDetailResponse {
  /** 영수증 상세 목록 */
  receipts?: ReceiptDetailItem[]
}

/** 등기 영수증 폼 조회 응답 */
export interface ReceiptDocumentFormResponse {
  /** 영수증ID */
  receiptDocumentId?: number
  /** 신청서ID */
  applicationId?: number
  /** 등기유형명 */
  registryTypeName?: string
  /** 등기권리자 명칭 */
  registryObligeeName?: string
  /** 발행일 */
  creationDate?: string
  /** 부동산 표시 */
  propertyDescription?: string
  fee?: FeeSection
  tax?: TaxSection
  bond?: BondSection
  businessSection?: BusinessSection
  typeSpecific?: TypeSpecificSection
}

/** 등기 영수증 목록 응답 */
export interface ReceiptDocumentListResponse {
  summaryTotals?: SummaryTotals
  /** 영수증 요약 목록 */
  receipts?: ReceiptSummaryItem[]
}

/** 등기 영수증 저장 요청 */
export interface ReceiptDocumentSaveRequest {
  /** 저장 대상 영수증 목록 */
  receipts?: ReceiptSaveItem[]
}

/** 영수증 저장 항목 */
export interface ReceiptSaveItem {
  /** 영수증ID */
  receiptDocumentId: number
  fee?: FeeSection
  tax?: TaxSection
  bond?: BondSection
}

/** 영수증 요약 항목 */
export interface ReceiptSummaryItem {
  /** 영수증ID */
  receiptDocumentId?: number
  /** 등기유형명 */
  registryTypeName?: string
  /** 보수료 소계 */
  feeSubtotal?: number
  /** 채권할인금액 */
  bondDiscountAmount?: number
  /** 등기비용 합계 */
  costTotal?: number
  /** 전자문서 생성 여부 */
  documentGenerated?: boolean
}

/** 목록 합계 */
export interface SummaryTotals {
  /** 보수료 소계 합계 */
  feeSubtotal?: number
  /** 공과금 소계 합계 */
  taxSubtotal?: number
  /** 채권할인금액 합계 */
  bondDiscountAmount?: number
  /** 등기비용 합계 */
  costTotal?: number
}

/** 공과금 정보 */
export interface TaxSection {
  /** 납부여부 */
  paymentStatus?: 'PAYMENT' | 'EXEMPTION'
  /** 면제사유 */
  exemptionReason?: string
  registrationLicenseTax?: number
  educationTax?: number
  ruralSpecialTax?: number
  /** 합계 */
  totalAmount?: number
}

/** 의뢰 업무별 추가 정보 */
export interface TypeSpecificSection {
  tradeAmount?: number
  standardMarketPrice?: number
  bondPurchaseAmount?: number
  maximumCreditAmount?: number
  taxBaseAmount?: number
  changeCount?: number
  correctionCount?: number
  cancellationCount?: number
  propertyDescription?: string
}
