// --------------------------------------------------
// [P02D] 지점-인터넷등기소
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetRegistryCredentialsParams, UpdateBranchRegistryCredentialsParams } from '@/types'

export const branchRegistryAPI = {
  async getList(params: GetRegistryCredentialsParams) {
    // --------------------------------------------------
    // [P02D-01][GET - /api/branches/{branchId}/registry-credentials] 인터넷등기소 아이디 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.BRANCH_REGISTRY.LIST(params.branchId))
  },

  async update(params: UpdateBranchRegistryCredentialsParams) {
    // --------------------------------------------------
    // [P02D-02][PATCH - /api/branches/{branchId}/registry-credentials] 인터넷등기소 아이디 수정
    // --------------------------------------------------
    return apiHelpers.patch(API.BRANCH_REGISTRY.UPDATE(params.branchId))
  }
}
