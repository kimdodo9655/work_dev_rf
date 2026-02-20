// --------------------------------------------------
// [R02K] 변경
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedApplicationChangesParams,
  GetDetailedApplicationChangesResponse,
  ReplaceApplicationChangesParams,
  ReplaceApplicationChangesRequest,
  ReplaceApplicationChangesResponse
} from '@/types'

export const registryChangeAPI = {
  async getDetail(params: GetDetailedApplicationChangesParams) {
    // --------------------------------------------------
    // [R02K-01][GET - /api/registry/applications/{applicationId}/changes] 등기명의인표시변경 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedApplicationChangesResponse>(
      API.REGISTRY_CHANGE.DETAIL(params.applicationId)
    )
  },

  async replace(params: ReplaceApplicationChangesParams, data: ReplaceApplicationChangesRequest) {
    // --------------------------------------------------
    // [R02K-02][PUT - /api/registry/applications/{applicationId}/changes] 등기명의인표시변경 대체
    // --------------------------------------------------
    return apiHelpers.put<ReplaceApplicationChangesResponse>(
      API.REGISTRY_CHANGE.REPLACE(params.applicationId),
      data
    )
  }
}
