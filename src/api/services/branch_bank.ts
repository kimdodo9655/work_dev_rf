// --------------------------------------------------
// [P02B] 지점-금융기관
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetAssignedBanksParams,
  GetAssignedBanksResponse,
  UpdateBranchAssignedBanksParams,
  UpdateBranchAssignedBanksRequest,
  UpdateBranchAssignedBanksResponse
} from '@/types'

export const branchBankAPI = {
  async getList(params: GetAssignedBanksParams) {
    // --------------------------------------------------
    // [P02B-01][GET - /api/branches/{branchId}/assigned-banks] 배정 금융기관 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetAssignedBanksResponse>(API.BRANCH_BANK.LIST(params.branchId))
  },

  async update(params: UpdateBranchAssignedBanksParams, data: UpdateBranchAssignedBanksRequest) {
    // --------------------------------------------------
    // [P02B-02][PATCH - /api/branches/{branchId}/assigned-banks] 배정 금융기관 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateBranchAssignedBanksResponse>(
      API.BRANCH_BANK.UPDATE(params.branchId),
      data
    )
  }
}
