// --------------------------------------------------
// [R01] 견적
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetEstimateDetailParams,
  GetEstimateDetailResponse,
  GetEstimateInfoByRegistryRequestNumberParams,
  GetEstimateInfoByRegistryRequestNumberResponse,
  GetEstimateListQuery,
  GetEstimateListResponse,
  SubmitEstimateParams,
  SubmitEstimateRequest,
  SubmitEstimateResponse,
  WithdrawEstimateParams,
  WithdrawEstimateResponse
} from '@/types'

export const registryQuoteAPI = {
  async getList(query: GetEstimateListQuery) {
    // --------------------------------------------------
    // [R01-01][GET - /api/registry/estimates] 견적 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetEstimateListResponse>(API.REGISTRY_QUOTE.LIST, query)
  },

  async getDetail(params: GetEstimateInfoByRegistryRequestNumberParams) {
    // --------------------------------------------------
    // [R01-02][GET - /api/registry/estimates/requests/{registryRequestNumber}/info] 등기의뢰 견적 대상 기본 정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetEstimateInfoByRegistryRequestNumberResponse>(
      API.REGISTRY_QUOTE.DETAIL(params.registryRequestNumber)
    )
  },

  async accept(params: GetEstimateDetailParams) {
    // --------------------------------------------------
    // [R01-03][GET - /api/registry/estimates/{estimateId}/details] 견적서 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetEstimateDetailResponse>(API.REGISTRY_QUOTE.ACCEPT(params.estimateId))
  },

  async reject(params: SubmitEstimateParams, data: SubmitEstimateRequest) {
    // --------------------------------------------------
    // [R01-04][POST - /api/registry/estimates/requests/{registryRequestNumber}/submit] 견적서 제출
    // --------------------------------------------------
    return apiHelpers.post<SubmitEstimateResponse>(
      API.REGISTRY_QUOTE.REJECT(params.registryRequestNumber),
      data
    )
  },

  async estimates(params: WithdrawEstimateParams) {
    // --------------------------------------------------
    // [R01-05][DELETE - /api/registry/estimates/{estimateId}] 견적서 철회
    // --------------------------------------------------
    return apiHelpers.delete<WithdrawEstimateResponse>(
      API.REGISTRY_QUOTE.ESTIMATES(params.estimateId)
    )
  }
}
