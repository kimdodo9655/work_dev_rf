// --------------------------------------------------
// [R01] 견적
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetEstimateDetailParams,
  GetEstimateInfoByRegistryRequestNumberParams,
  GetEstimateListQuery,
  SubmitEstimateParams,
  WithdrawEstimateParams
} from '@/types'

export const registryQuoteAPI = {
  async getList(query: GetEstimateListQuery) {
    // --------------------------------------------------
    // [R01-01][GET - /api/registry/estimates] 견적 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_QUOTE.LIST, query)
  },

  async getDetail(params: GetEstimateInfoByRegistryRequestNumberParams) {
    // --------------------------------------------------
    // [R01-02][GET - /api/registry/estimates/requests/{registryRequestNumber}/info] 등기의뢰 견적 대상 기본 정보 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_QUOTE.DETAIL(params.registryRequestNumber))
  },

  async accept(params: GetEstimateDetailParams) {
    // --------------------------------------------------
    // [R01-03][GET - /api/registry/estimates/{estimateId}/details] 견적서 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_QUOTE.ACCEPT(params.estimateId))
  },

  async reject(params: SubmitEstimateParams) {
    // --------------------------------------------------
    // [R01-04][POST - /api/registry/estimates/requests/{registryRequestNumber}/submit] 견적서 제출
    // --------------------------------------------------
    return apiHelpers.post(API.REGISTRY_QUOTE.REJECT(params.registryRequestNumber))
  },

  async estimates(params: WithdrawEstimateParams) {
    // --------------------------------------------------
    // [R01-05][DELETE - /api/registry/estimates/{estimateId}] 견적서 철회
    // --------------------------------------------------
    return apiHelpers.delete(API.REGISTRY_QUOTE.ESTIMATES(params.estimateId))
  }
}
