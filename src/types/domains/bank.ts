/**
 * 금융기관 정보
 */
export interface Bank {
  code: string
  name: string
  tier: number
  isActive: boolean
}

/**
 * 금융기관 목록
 */
export type BankList = Bank[]
