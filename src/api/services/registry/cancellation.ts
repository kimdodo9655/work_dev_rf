// --------------------------------------------------
// [R02M] 말소
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetRegistryApplicationCancellationDetailParams,
  SaveRegistryApplicationCancellationsParams
} from '@/types'

export const registryCancellationAPI = {
  async getDetail(params: GetRegistryApplicationCancellationDetailParams) {
    // --------------------------------------------------
    // [R02M-01][GET - /api/registry/applications/{applicationId}/cancellations] 말소사항 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CANCELLATION.DETAIL(params.applicationId))
  },

  async replace(params: SaveRegistryApplicationCancellationsParams) {
    // --------------------------------------------------
    // [R02M-02][PUT - /api/registry/applications/{applicationId}/cancellations] 말소사항 대체
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CANCELLATION.REPLACE(params.applicationId))
  }
}
