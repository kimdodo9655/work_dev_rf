/**
 * REGISTRY_LOAN_ACCOUNT API Types
 * @generated 2025-01-27
 */

import type { DocumentDownloadBase64Response } from './common.types'

/**
 * R02R-01
 * GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/detail
 */
export interface GetLoanPaymentAccountsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetLoanPaymentAccountsResponse = LoanPaymentAccountDetailResponse

/**
 * R02R-02
 * GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/list
 */
export interface GetLoanPaymentAccountListParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetLoanPaymentAccountListResponse = LoanPaymentAccountListResponse

/**
 * R02R-03
 * PUT /api/registry/progress/{registryManagementNumber}/loan-payment-accounts
 */
export interface SaveLoanPaymentAccountsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type SaveLoanPaymentAccountsRequest = LoanPaymentAccountListSaveRequest

export type SaveLoanPaymentAccountsResponse = LoanPaymentAccountDetailResponse

/**
 * R02R-06
 * GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt
 */
export interface DownloadReceiptParams {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 대출금 지급계좌 ID */
  loanPaymentAccountId: number
}

export type DownloadReceiptResponse = DocumentDownloadBase64Response

/**
 * R02R-04
 * POST /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt
 */
export interface UploadReceiptParams {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 대출금 지급계좌 ID */
  loanPaymentAccountId: number
}

export interface UploadReceiptRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadReceiptResponse = LoanPaymentAccountDetailResponse

/**
 * R02R-05
 * DELETE /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt
 */
export interface DeleteReceiptParams {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 대출금 지급계좌 ID */
  loanPaymentAccountId: number
}

export type DeleteReceiptResponse = LoanPaymentAccountDetailResponse

// ==================== Schemas ====================

/** 매수자 요약 */
export interface Buyer {
  tradeAmount?: number
  downPaymentAmount?: number
  loanPaymentAmount?: number
  loanBalanceAmount?: number
  buyerExpense?: number
  buyerRefund?: number
}

/** 채무자 요약 */
export interface Debtor {
  loanPrincipal?: number
  loanRepaymentAmount?: number
  debtorReceivable?: number
  debtorExpense?: number
  cancellationFee?: number
}

/** 대출금융기관 요약 */
export interface LoanInstitution {
  items?: LoanInstitutionItem[]
  totalScheduledAmount?: number
}

/** 대출금융기관 행 */
export interface LoanInstitutionItem {
  paymentType?: string
  paymentSubject?: string
  paymentBank?: string
  accountNumber?: string
  scheduledPaymentAmount?: number
}

/** 법무대리인 지급계좌 옵션 */
export interface LoanPaymentAccountBranchAccountOption {
  branchPaymentAccountId?: number
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  accountType?: string
}

/** 지급 비용 요약 */
export interface LoanPaymentAccountCostSummary {
  loanInstitution?: LoanInstitution
  buyer?: Buyer
  seller?: Seller
  debtor?: Debtor
}

/** 대출금 지급계좌 상세 응답 */
export interface LoanPaymentAccountDetailResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 신규 대출 금액 */
  newLoanAmount?: number
  /** 누적 지급 예정 금액 */
  accumulatedScheduledAmount?: number
  /** 미등록 지급 예정 금액 */
  remainingScheduledAmount?: number
  /** 지급 계좌 목록 */
  paymentItems?: LoanPaymentAccountItem[]
  costSummary?: LoanPaymentAccountCostSummary
  /** 선순위 대출 옵션 */
  priorLoanOptions?: LoanPaymentAccountPriorLoanOption[]
  /** 허용 지급구분 목록 */
  paymentTypeOptions?: string[]
  /** 지급구분별 허용 지급주체 */
  paymentSubjectOptions?: Record<string, string[]>
  /** 법무대리인 지급계좌 옵션 */
  branchPaymentAccountOptions?: LoanPaymentAccountBranchAccountOption[]
}

/** 지급계좌 행 */
export interface LoanPaymentAccountItem {
  /** 대출금지급계좌ID */
  loanPaymentAccountId?: number
  /** 지급구분 */
  paymentType?: string
  /** 지급주체 */
  paymentSubject?: string
  /** 지급 금융기관 */
  paymentBank?: string
  /** 지급 계좌번호 */
  accountNumber?: string
  /** 예금주 */
  accountHolder?: string
  /** 선순위 설정 금융기관 */
  seniorMortgageBank?: string
  /** 선순위 설정 채권최고액 */
  seniorMaximumCreditAmount?: number
  /** 대출상환 취급지점 */
  loanRedemptionBranch?: string
  /** 지급 금액 (말소비용 제외) */
  paymentAmount?: number
  /** 말소비용 */
  cancellationFee?: number
  /** 지급 예정 금액 */
  scheduledPaymentAmount?: number
  /** 상환영수증 등록 여부 */
  receiptUploaded?: boolean
  /** 생성일시 ISO8601 문자열 */
  createdAt?: string
}

/** 지급계좌 등록 목록 항목 */
export interface LoanPaymentAccountListItem {
  /** 지급계좌ID */
  loanPaymentAccountId?: number
  /** 지급구분(한글) */
  paymentType?: string
  /** 지급주체(한글) */
  paymentSubject?: string
  /** 지급금액 */
  paymentAmount?: number
  /** 지급은행 */
  paymentBank?: string
  /** 지급계좌번호 */
  accountNumber?: string
  /** 상환영수증 등록 여부 */
  receiptUploaded?: boolean
  /** 상세 링크 */
  detailLink?: string
}

/** 대출금 지급계좌 등록 목록 응답 */
export interface LoanPaymentAccountListResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 지급계좌 리스트 */
  items?: LoanPaymentAccountListItem[]
}

/** 지급계좌 일괄 저장 요청 */
export interface LoanPaymentAccountListSaveRequest {
  /** 지급계좌 리스트 */
  paymentItems: LoanPaymentAccountItem[]
}

/** 선순위 대출 옵션 */
export interface LoanPaymentAccountPriorLoanOption {
  seniorLoanId?: number
  rightHolderName?: string
  maximumCreditAmount?: number
  rightHolderBranch?: string
}

/** 매도자 요약 */
export interface Seller {
  tradeAmount?: number
  downPaymentAmount?: number
  loanRepaymentAmount?: number
  sellerReceivable?: number
  sellerExpense?: number
  cancellationFee?: number
}
