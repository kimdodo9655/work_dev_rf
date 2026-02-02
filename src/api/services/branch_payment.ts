// --------------------------------------------------
// [P02C] 지점-지급계좌
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetPaymentAccountsParams, UpdateBranchPaymentAccountsParams } from '@/types'

export const branchPaymentAPI = {
  async getList(params: GetPaymentAccountsParams) {
    // --------------------------------------------------
    // [P02C-01][GET - /api/branches/{branchId}/payment-accounts] 지급계좌 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.BRANCH_PAYMENT.LIST(params.branchId))
  },

  async update(params: UpdateBranchPaymentAccountsParams) {
    // --------------------------------------------------
    // [P02C-02][PATCH - /api/branches/{branchId}/payment-accounts] 지급계좌 수정
    // --------------------------------------------------
    return apiHelpers.patch(API.BRANCH_PAYMENT.UPDATE(params.branchId))
  }
}
