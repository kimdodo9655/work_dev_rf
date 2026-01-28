/**
 * BRANCH_PAYMENT API Types
 * @generated 2025-01-27
 */

/**
 * P02C-01
 * GET /api/branches/{branchId}/payment-accounts
 */
export interface GetPaymentAccountsParams {
  /** 지점 ID */
  branchId: number
}

export type GetPaymentAccountsResponse = BranchPaymentAccountResponse

/**
 * P02C-02
 * PATCH /api/branches/{branchId}/payment-accounts
 */
export interface UpdateBranchPaymentAccountsParams {
  /** 지점 ID */
  branchId: number
}

export type UpdateBranchPaymentAccountsRequest = BranchPaymentAccountItem[]

// ==================== Schemas ====================

/** 지급계좌 구분 */
export type AccountType = 'FEE' | 'TAX' | 'BOND' | 'ETC'

/** 지점 지급계좌 항목 */
export interface BranchPaymentAccountItem {
  accountType: AccountType
  /** 지급 금융기관 이름 */
  bankName: string
  /** 지급 계좌번호 */
  accountNumber: string
  /** 예금주 명 */
  accountHolder: string
}

/** 지점 지급계좌 응답 */
export interface BranchPaymentAccountResponse {
  /** 지점 ID */
  branchId?: number
  accountType?: AccountType
  /** 지급계좌 구분 설명 */
  accountTypeDescription?: string
  /** 지급 금융기관명 */
  bankName?: string
  /** 지급 계좌번호 */
  accountNumber?: string
  /** 예금주 명 */
  accountHolder?: string
}
