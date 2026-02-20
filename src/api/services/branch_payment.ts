// --------------------------------------------------
// [P02C] 지점-지급계좌
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetPaymentAccountsParams,
  GetPaymentAccountsResponse,
  UpdateBranchPaymentAccountsParams,
  UpdateBranchPaymentAccountsRequest,
  UpdateBranchPaymentAccountsResponse
} from '@/types'

export const branchPaymentAPI = {
  async getList(params: GetPaymentAccountsParams) {
    // --------------------------------------------------
    // [P02C-01][GET - /api/branches/{branchId}/payment-accounts] 지급계좌 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPaymentAccountsResponse>(API.BRANCH_PAYMENT.LIST(params.branchId))
  },

  async update(
    params: UpdateBranchPaymentAccountsParams,
    data: UpdateBranchPaymentAccountsRequest
  ) {
    // --------------------------------------------------
    // [P02C-02][PATCH - /api/branches/{branchId}/payment-accounts] 지급계좌 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateBranchPaymentAccountsResponse>(
      API.BRANCH_PAYMENT.UPDATE(params.branchId),
      data
    )
  }
}
