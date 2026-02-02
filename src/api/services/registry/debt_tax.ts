// --------------------------------------------------
// [R02H] 채권세금
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetParams, ReplaceParams } from '@/types'

export const registryDebtTaxAPI = {
  async getDetail(params: GetParams) {
    // --------------------------------------------------
    // [R02H-01][GET - /api/registry/applications/{applicationId}/mortgage/financial] 채권및세금 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_DEBT_TAX.DETAIL(params.applicationId))
  },

  async replace(params: ReplaceParams) {
    // --------------------------------------------------
    // [R02H-02][POST - /api/registry/applications/{applicationId}/mortgage/financial] 채권및세금 대체
    // --------------------------------------------------
    return apiHelpers.post(API.REGISTRY_DEBT_TAX.REPLACE(params.applicationId))
  }
}
