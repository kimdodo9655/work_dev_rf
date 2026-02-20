// --------------------------------------------------
// [R02I] 세금
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetTaxInfoParams,
  GetTaxInfoResponse,
  SaveTaxInfoParams,
  SaveTaxInfoRequest,
  SaveTaxInfoResponse
} from '@/types'

export const registryTaxAPI = {
  async getDetail(params: GetTaxInfoParams) {
    // --------------------------------------------------
    // [R02I-01][GET - /api/registry/applications/{applicationId}/ownership/tax/detail] 세금 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetTaxInfoResponse>(API.REGISTRY_TAX.DETAIL(params.applicationId))
  },

  async update(params: SaveTaxInfoParams, data: SaveTaxInfoRequest) {
    // --------------------------------------------------
    // [R02I-02][POST - /api/registry/applications/{applicationId}/ownership/tax] 세금 수정
    // --------------------------------------------------
    return apiHelpers.post<SaveTaxInfoResponse>(API.REGISTRY_TAX.UPDATE(params.applicationId), data)
  }
}
