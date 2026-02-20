// --------------------------------------------------
// [R02E] 계약
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetContractPartiesParams,
  GetContractPartiesResponse,
  GetMortgageContractParams,
  GetMortgageContractResponse,
  GetOwnershipContractParams,
  GetOwnershipContractResponse,
  GetSurfaceRightContractParams,
  GetSurfaceRightContractResponse,
  ReplaceContractPartiesParams,
  ReplaceContractPartiesRequest,
  ReplaceContractPartiesResponse,
  SaveMortgageContractParams,
  SaveMortgageContractRequest,
  SaveMortgageContractResponse,
  SaveOwnershipContractParams,
  SaveOwnershipContractRequest,
  SaveOwnershipContractResponse,
  SaveSurfaceRightContractParams,
  SaveSurfaceRightContractRequest,
  SaveSurfaceRightContractResponse
} from '@/types'

export const registryContractAPI = {
  async getDetail(params: GetContractPartiesParams) {
    // --------------------------------------------------
    // [R02E-01][GET - /api/registry/applications/{applicationId}/contracts/parties] 계약당사자 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetContractPartiesResponse>(
      API.REGISTRY_CONTRACT.DETAIL(params.applicationId)
    )
  },

  async save(params: ReplaceContractPartiesParams, data: ReplaceContractPartiesRequest) {
    // --------------------------------------------------
    // [R02E-02][PUT - /api/registry/applications/{applicationId}/contracts/parties] 계약당사자 일괄 저장
    // --------------------------------------------------
    return apiHelpers.put<ReplaceContractPartiesResponse>(
      API.REGISTRY_CONTRACT.SAVE(params.applicationId),
      data
    )
  },

  async ownership(params: GetOwnershipContractParams) {
    // --------------------------------------------------
    // [R02E-03][GET - /api/registry/applications/{applicationId}/contracts/ownership] 소유권이전 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetOwnershipContractResponse>(
      API.REGISTRY_CONTRACT.OWNERSHIP(params.applicationId)
    )
  },

  async save2(params: SaveOwnershipContractParams, data: SaveOwnershipContractRequest) {
    // --------------------------------------------------
    // [R02E-04][PUT - /api/registry/applications/{applicationId}/contracts/ownership] 소유권이전 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put<SaveOwnershipContractResponse>(
      API.REGISTRY_CONTRACT.SAVE_2(params.applicationId),
      data
    )
  },

  async mortgage(params: GetMortgageContractParams) {
    // --------------------------------------------------
    // [R02E-05][GET - /api/registry/applications/{applicationId}/contracts/mortgage] 근저당권설정 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetMortgageContractResponse>(
      API.REGISTRY_CONTRACT.MORTGAGE(params.applicationId)
    )
  },

  async save3(params: SaveMortgageContractParams, data: SaveMortgageContractRequest) {
    // --------------------------------------------------
    // [R02E-06][PUT - /api/registry/applications/{applicationId}/contracts/mortgage] 근저당권설정 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put<SaveMortgageContractResponse>(
      API.REGISTRY_CONTRACT.SAVE_3(params.applicationId),
      data
    )
  },

  async surfaceRight(params: GetSurfaceRightContractParams) {
    // --------------------------------------------------
    // [R02E-07][GET - /api/registry/applications/{applicationId}/contracts/surface-right] 지상권설정 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get<GetSurfaceRightContractResponse>(
      API.REGISTRY_CONTRACT.SURFACE_RIGHT(params.applicationId)
    )
  },

  async save4(params: SaveSurfaceRightContractParams, data: SaveSurfaceRightContractRequest) {
    // --------------------------------------------------
    // [R02E-08][PUT - /api/registry/applications/{applicationId}/contracts/surface-right] 지상권설정 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put<SaveSurfaceRightContractResponse>(
      API.REGISTRY_CONTRACT.SAVE_4(params.applicationId),
      data
    )
  }
}
