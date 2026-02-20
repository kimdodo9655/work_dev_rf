// --------------------------------------------------
// [R02F] 부동산
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedApplicationPropertyParams,
  GetDetailedApplicationPropertyResponse,
  ReplaceApplicationPropertyParams,
  ReplaceApplicationPropertyRequest,
  ReplaceApplicationPropertyResponse
} from '@/types'

export const registryPropertyAPI = {
  async getDetail(params: GetDetailedApplicationPropertyParams) {
    // --------------------------------------------------
    // [R02F-01][GET - /api/registry/applications/{applicationId}/properties] 부동산 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedApplicationPropertyResponse>(
      API.REGISTRY_PROPERTY.DETAIL(params.applicationId)
    )
  },

  async replace(params: ReplaceApplicationPropertyParams, data: ReplaceApplicationPropertyRequest) {
    // --------------------------------------------------
    // [R02F-02][PUT - /api/registry/applications/{applicationId}/properties] 부동산 대체
    // --------------------------------------------------
    return apiHelpers.put<ReplaceApplicationPropertyResponse>(
      API.REGISTRY_PROPERTY.REPLACE(params.applicationId),
      data
    )
  }
}
