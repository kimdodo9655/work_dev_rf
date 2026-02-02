// --------------------------------------------------
// [P02E] 지점-선불지급수단
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetPrepaidCardsParams, UpdateBranchPrepaidCardsParams } from '@/types'

export const branchPrepaidAPI = {
  async getList(params: GetPrepaidCardsParams) {
    // --------------------------------------------------
    // [P02E-01][GET - /api/branches/{branchId}/prepaid-cards] 선불지급수단 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.BRANCH_PREPAID.LIST(params.branchId))
  },

  async update(params: UpdateBranchPrepaidCardsParams) {
    // --------------------------------------------------
    // [P02E-02][PATCH - /api/branches/{branchId}/prepaid-cards] 선불지급수단 수정
    // --------------------------------------------------
    return apiHelpers.patch(API.BRANCH_PREPAID.UPDATE(params.branchId))
  }
}
