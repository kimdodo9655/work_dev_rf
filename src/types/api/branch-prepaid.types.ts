/**
 * BRANCH_PREPAID API Types
 * @generated 2025-01-27
 */

import type { ActionType, BranchPrepaidCardResponse } from './common.types'

/**
 * P02E-01
 * GET /api/branches/{branchId}/prepaid-cards
 */
export interface GetPrepaidCardsParams {
  /** 지점 ID */
  branchId: number
}

export type GetPrepaidCardsResponse = BranchPrepaidCardResponse

/**
 * P02E-02
 * PATCH /api/branches/{branchId}/prepaid-cards
 */
export interface UpdateBranchPrepaidCardsParams {
  /** 지점 ID */
  branchId: number
}

export type UpdateBranchPrepaidCardsRequest = BranchPrepaidCardItem[]

// ==================== Schemas ====================

/** 지점 선불지급수단 항목 */
export interface BranchPrepaidCardItem {
  action: ActionType
  /** 선불지급수단 고유번호(MODIFY/DELETE 시 필수) */
  cardId?: number
  /** 선불지급수단 카드번호 */
  cardNumber: string
  /** 카드 비밀번호 */
  cardPassword?: string
  /** 사용처 */
  usageAgency?: string
  /** 사용목적 */
  usagePurpose?: string
}
