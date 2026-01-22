/**
 * 금융기관 관련 타입 정의
 * @file src/types/domains/bank.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 금융기관 정보
 * Schema: BankResponse
 * API: GET /api/banks, GET /api/banks/{code}
 */
export interface Bank {
  /** 금융기관 코드 */
  code: string
  /** 금융기관명 */
  name: string
  /** 금융권 (tier) */
  tier: number
  /** 활성 상태 */
  isActive: boolean
}

/**
 * 금융기관 목록
 * API: GET /api/banks
 */
export type BankList = Bank[]
