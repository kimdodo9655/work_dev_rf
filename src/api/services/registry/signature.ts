// --------------------------------------------------
// [R02O] 전자서명
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CompleteESignatureParams,
  CompleteESignatureResponse,
  GetDetailedESignaturesQuery,
  GetDetailedESignaturesResponse,
  GetESignaturesQuery,
  GetESignaturesResponse,
  RequestESignatureParams,
  RequestESignatureResponse,
  ReRequestESignatureParams,
  ReRequestESignatureResponse
} from '@/types'

export const registrySignatureAPI = {
  async getDetail(query: GetDetailedESignaturesQuery) {
    // --------------------------------------------------
    // [R02O-01][GET - /api/registry/progress/{registryManagementNumber}/e-signatures/detail] 전자서명 진행 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<GetDetailedESignaturesResponse>(
      API.REGISTRY_SIGNATURE.DETAIL(registryManagementNumber),
      params
    )
  },

  async request(params: RequestESignatureParams) {
    // --------------------------------------------------
    // [R02O-02][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/request] 전자서명 요청
    // --------------------------------------------------
    const { registryManagementNumber, eSignatureId, ...data } = params as any
    return apiHelpers.post<RequestESignatureResponse>(
      API.REGISTRY_SIGNATURE.REQUEST(registryManagementNumber, eSignatureId),
      data
    )
  },

  async complete(params: CompleteESignatureParams) {
    // --------------------------------------------------
    // [R02O-03][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/complete] 전자서명 완료
    // --------------------------------------------------
    const { registryManagementNumber, eSignatureId, ...data } = params as any
    return apiHelpers.post<CompleteESignatureResponse>(
      API.REGISTRY_SIGNATURE.COMPLETE(registryManagementNumber, eSignatureId),
      data
    )
  },

  async reRequest(params: ReRequestESignatureParams) {
    // --------------------------------------------------
    // [R02O-04][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/re-request] 전자서명 재요청
    // --------------------------------------------------
    const { registryManagementNumber, eSignatureId, ...data } = params as any
    return apiHelpers.post<ReRequestESignatureResponse>(
      API.REGISTRY_SIGNATURE.RE_REQUEST(registryManagementNumber, eSignatureId),
      data
    )
  },

  async getList(query: GetESignaturesQuery) {
    // --------------------------------------------------
    // [R02O-05][GET - /api/registry/progress/{registryManagementNumber}/e-signatures/list] 전자서명 진행 정보 목록 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query as any
    return apiHelpers.get<GetESignaturesResponse>(
      API.REGISTRY_SIGNATURE.LIST(registryManagementNumber),
      params
    )
  }
}
