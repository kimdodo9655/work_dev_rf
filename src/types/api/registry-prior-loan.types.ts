/**
 * 문서 경로: `@/src/types/api/registry-prior-loan.types.ts`
 * 문서 제목: 타입 정의: registry-prior-loan-types
 */

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
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 해당 구 */
  section?: 'GAP' | 'EUL'
  /** 선순위 설정 금융기관명 */
  rightHolderName?: string
  /** 선순위 설정 취급지점 */
  rightHolderBranch?: string
  /** 순위번호 */
  rankNumber?: string
  /** 설정 접수 일자 */
  receiptDate?: string
  /** 설정 접수 번호 */
  receiptNumber?: string
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
