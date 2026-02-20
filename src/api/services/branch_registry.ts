// --------------------------------------------------
// [P02D] 지점-인터넷등기소
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetRegistryCredentialsParams,
  GetRegistryCredentialsResponse,
  UpdateBranchRegistryCredentialsParams,
  UpdateBranchRegistryCredentialsRequest,
  UpdateBranchRegistryCredentialsResponse
} from '@/types'

export const branchRegistryAPI = {
  async getList(params: GetRegistryCredentialsParams) {
    // --------------------------------------------------
    // [P02D-01][GET - /api/branches/{branchId}/registry-credentials] 인터넷등기소 아이디 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryCredentialsResponse>(API.BRANCH_REGISTRY.LIST(params.branchId))
  },

  async update(
    params: UpdateBranchRegistryCredentialsParams,
    data: UpdateBranchRegistryCredentialsRequest
  ) {
    // --------------------------------------------------
    // [P02D-02][PATCH - /api/branches/{branchId}/registry-credentials] 인터넷등기소 아이디 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateBranchRegistryCredentialsResponse>(
      API.BRANCH_REGISTRY.UPDATE(params.branchId),
      data
    )
  }
}
