// --------------------------------------------------
// [R02L] 경정
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedApplicationCorrectionsParams,
  ReplaceApplicationCorrectionsParams
} from '@/types'

export const registryCorrectionAPI = {
  async getDetail(params: GetDetailedApplicationCorrectionsParams) {
    // --------------------------------------------------
    // [R02L-01][GET - /api/registry/applications/{applicationId}/correction] 등기명의인표시경정 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CORRECTION.DETAIL(params.applicationId))
  },

  async replace(params: ReplaceApplicationCorrectionsParams) {
    // --------------------------------------------------
    // [R02L-02][PUT - /api/registry/applications/{applicationId}/correction] 등기명의인표시경정 대체
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CORRECTION.REPLACE(params.applicationId))
  }
}
