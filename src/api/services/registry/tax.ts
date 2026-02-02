// --------------------------------------------------
// [R02I] 세금
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetTaxInfoParams, SaveTaxInfoParams } from '@/types'

export const registryTaxAPI = {
  async getDetail(params: GetTaxInfoParams) {
    // --------------------------------------------------
    // [R02I-01][GET - /api/registry/applications/{applicationId}/ownership/tax/detail] 세금 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_TAX.DETAIL(params.applicationId))
  },

  async update(params: SaveTaxInfoParams) {
    // --------------------------------------------------
    // [R02I-02][POST - /api/registry/applications/{applicationId}/ownership/tax] 세금 수정
    // --------------------------------------------------
    return apiHelpers.post(API.REGISTRY_TAX.UPDATE(params.applicationId))
  }
}
