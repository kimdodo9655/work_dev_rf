/**
 * 문서 경로: `@/src/api/services/registry/signature.ts`
 * 문서 제목: API 서비스: signature
 */

// --------------------------------------------------
// [R02O] 전자서명
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  CompleteESignatureParams,
  CompleteESignatureRequest,
  CompleteESignatureResponse,
  GetDetailedESignaturesQuery,
  GetDetailedESignaturesRequest,
  GetDetailedESignaturesResponse,
  GetESignaturesQuery,
  GetESignaturesRequest,
  GetESignaturesResponse,
  RequestESignatureParams,
  RequestESignatureResponse,
  ReRequestESignatureParams,
  ReRequestESignatureResponse
} from '@/types'

export const registrySignatureAPI = {
  async getDetail(query: GetDetailedESignaturesRequest) {
    // --------------------------------------------------
    // [R02O-01][GET - /api/registry/progress/{registryManagementNumber}/e-signatures/detail] 전자서명 진행 정보 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query
    const detailQuery: GetDetailedESignaturesQuery = params
    return apiHelpers.get<GetDetailedESignaturesResponse>(
      API.REGISTRY_SIGNATURE.DETAIL(registryManagementNumber),
      detailQuery
    )
  },

  async request(params: RequestESignatureParams) {
    // --------------------------------------------------
    // [R02O-02][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/request] 전자서명 요청
    // --------------------------------------------------
    return apiHelpers.post<RequestESignatureResponse>(
      API.REGISTRY_SIGNATURE.REQUEST(params.registryManagementNumber, params.eSignatureId)
    )
  },

  async complete(params: CompleteESignatureParams, data: CompleteESignatureRequest) {
    // --------------------------------------------------
    // [R02O-03][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/complete] 전자서명 완료
    // --------------------------------------------------
    return apiHelpers.post<CompleteESignatureResponse>(
      API.REGISTRY_SIGNATURE.COMPLETE(params.registryManagementNumber, params.eSignatureId),
      data
    )
  },

  async reRequest(params: ReRequestESignatureParams) {
    // --------------------------------------------------
    // [R02O-04][POST - /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/re-request] 전자서명 재요청
    // --------------------------------------------------
    return apiHelpers.post<ReRequestESignatureResponse>(
      API.REGISTRY_SIGNATURE.RE_REQUEST(params.registryManagementNumber, params.eSignatureId)
    )
  },

  async getList(query: GetESignaturesRequest) {
    // --------------------------------------------------
    // [R02O-05][GET - /api/registry/progress/{registryManagementNumber}/e-signatures/list] 전자서명 진행 정보 목록 조회
    // --------------------------------------------------
    const { registryManagementNumber, ...params } = query
    const listQuery: GetESignaturesQuery = params
    return apiHelpers.get<GetESignaturesResponse>(
      API.REGISTRY_SIGNATURE.LIST(registryManagementNumber),
      listQuery
    )
  }
}
