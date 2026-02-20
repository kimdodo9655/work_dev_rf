// --------------------------------------------------
// [R02Q] 주택채권
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetHousingBondDetailsParams,
  GetHousingBondDetailsResponse,
  SaveHousingBondParams,
  SaveHousingBondRequest,
  SaveHousingBondResponse
} from '@/types'

export const registryHousingBondAPI = {
  async getDetail(params: GetHousingBondDetailsParams) {
    // --------------------------------------------------
    // [R02Q-01][GET - /api/registry/progress/{registryManagementNumber}/housing-bonds/detail] 국민주택채권 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetHousingBondDetailsResponse>(
      API.REGISTRY_HOUSING_BOND.DETAIL(params.registryManagementNumber)
    )
  },

  async detail2(params: SaveHousingBondParams, data: SaveHousingBondRequest) {
    // --------------------------------------------------
    // [R02Q-02][PUT - /api/registry/progress/{registryManagementNumber}/housing-bonds/{registryType}] 국민주택채권 상세 저장
    // --------------------------------------------------
    return apiHelpers.put<SaveHousingBondResponse>(
      API.REGISTRY_HOUSING_BOND.DETAIL_2(params.registryManagementNumber, params.registryType),
      data
    )
  }
}
