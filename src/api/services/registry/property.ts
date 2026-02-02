// --------------------------------------------------
// [R02F] 부동산
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedApplicationPropertyParams,
  ReplaceApplicationPropertyParams
} from '@/types'

export const registryPropertyAPI = {
  async getDetail(params: GetDetailedApplicationPropertyParams) {
    // --------------------------------------------------
    // [R02F-01][GET - /api/registry/applications/{applicationId}/properties] 부동산 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_PROPERTY.DETAIL(params.applicationId))
  },

  async replace(params: ReplaceApplicationPropertyParams) {
    // --------------------------------------------------
    // [R02F-02][PUT - /api/registry/applications/{applicationId}/properties] 부동산 대체
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_PROPERTY.REPLACE(params.applicationId))
  }
}
