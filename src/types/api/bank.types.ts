/**
 * BANK API Types
 * @generated 2025-01-27
 */

/**
 * P05-01
 * GET /api/banks
 */
export type GetBanksResponse = BankResponse

/**
 * P05-02
 * GET /api/banks/{code}
 */
export interface GetBankParams {
  code: string
}

export type GetBankResponse = BankResponse

// ==================== Schemas ====================

/** 금융기관 응답 */
export interface BankResponse {
  /** 금융기관 코드 */
  code?: string
  /** 금융기관명 */
  name?: string
  /** 금융권 */
  tier?: number
  /** 상태 */
  isActive?: boolean
}
