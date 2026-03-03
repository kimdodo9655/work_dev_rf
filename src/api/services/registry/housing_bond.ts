/**
 * 문서 경로: `@/src/api/services/registry/housing_bond.ts`
 * 문서 제목: housing bond 구현 파일
 */

// --------------------------------------------------
// [R02Q] 주택채권
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetHousingBondDetailsParams,
  GetHousingBondDetailsResponse,
  GetHousingBondListParams,
  GetHousingBondListResponse,
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

  async getList(params: GetHousingBondListParams) {
    // --------------------------------------------------
    // [R02Q-03][GET - /api/registry/progress/{registryManagementNumber}/housing-bonds/list] 국민주택채권 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetHousingBondListResponse>(
      API.REGISTRY_HOUSING_BOND.LIST(params.registryManagementNumber)
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
