/**
 * BRANCH_BANK API Types
 * @generated 2025-01-27
 */

import type { BranchAssignedBankItem, RegistryTypeForAssign } from './common.types'

/**
 * P02B-01
 * GET /api/branches/{branchId}/assigned-banks
 */
export interface GetAssignedBanksParams {
  /** 지점 ID */
  branchId: number
}

export type GetAssignedBanksResponse = BranchAssignedBankResponse

/**
 * P02B-02
 * PATCH /api/branches/{branchId}/assigned-banks
 */
export interface UpdateBranchAssignedBanksParams {
  /** 지점 ID */
  branchId: number
}

export type UpdateBranchAssignedBanksRequest = BranchAssignedBankItem[]

// ==================== Schemas ====================

/** 지점 배정 금융기관 응답 */
export interface BranchAssignedBankResponse {
  registryType?: RegistryTypeForAssign
  /** 등기유형 설명 */
  registryTypeDescription?: string
  /** 금융기관 코드 */
  bankCode?: string
  /** 금융기관 명칭 */
  bankName?: string
}
