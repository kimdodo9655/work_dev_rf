/**
 * REGISTRY_PRIOR_LOAN API Types
 * @generated 2025-01-27
 */

/**
 * R02C-01
 * GET /api/registry/progress/{registryManagementNumber}/senior-loan-repayments
 */
export interface GetSeniorLoanRepaymentsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetSeniorLoanRepaymentsResponse = RegistryProgressSeniorLoanRepaymentListResponse

// ==================== Schemas ====================

/** 선순위 대출 상환 정보 항목 */
export interface RegistryProgressSeniorLoanRepaymentItemResponse {
  /** 선순위 설정 금융기관명 */
  rightHolderName?: string
  /** 순위번호 */
  rankNumber?: string
  /** 채권최고액 */
  maximumCreditAmount?: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject?: string
}

/** 선순위 대출 상환 정보 목록 */
export interface RegistryProgressSeniorLoanRepaymentListResponse {
  /** 선순위 대출 상환 정보 목록 */
  seniorLoans?: RegistryProgressSeniorLoanRepaymentItemResponse[]
}
