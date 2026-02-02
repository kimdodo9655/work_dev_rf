// --------------------------------------------------
// [R02E] 계약
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetContractPartiesParams,
  GetMortgageContractParams,
  GetOwnershipContractParams,
  GetSurfaceRightContractParams,
  ReplaceContractPartiesParams,
  SaveMortgageContractParams,
  SaveOwnershipContractParams,
  SaveSurfaceRightContractParams
} from '@/types'

export const registryContractAPI = {
  async getDetail(params: GetContractPartiesParams) {
    // --------------------------------------------------
    // [R02E-01][GET - /api/registry/applications/{applicationId}/contracts/parties] 계약당사자 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CONTRACT.DETAIL(params.applicationId))
  },

  async save(params: ReplaceContractPartiesParams) {
    // --------------------------------------------------
    // [R02E-02][PUT - /api/registry/applications/{applicationId}/contracts/parties] 계약당사자 일괄 저장
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CONTRACT.SAVE(params.applicationId))
  },

  async ownership(params: GetOwnershipContractParams) {
    // --------------------------------------------------
    // [R02E-03][GET - /api/registry/applications/{applicationId}/contracts/ownership] 소유권이전 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CONTRACT.OWNERSHIP(params.applicationId))
  },

  async save2(params: SaveOwnershipContractParams) {
    // --------------------------------------------------
    // [R02E-04][PUT - /api/registry/applications/{applicationId}/contracts/ownership] 소유권이전 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CONTRACT.SAVE_2(params.applicationId))
  },

  async mortgage(params: GetMortgageContractParams) {
    // --------------------------------------------------
    // [R02E-05][GET - /api/registry/applications/{applicationId}/contracts/mortgage] 근저당권설정 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CONTRACT.MORTGAGE(params.applicationId))
  },

  async save3(params: SaveMortgageContractParams) {
    // --------------------------------------------------
    // [R02E-06][PUT - /api/registry/applications/{applicationId}/contracts/mortgage] 근저당권설정 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CONTRACT.SAVE_3(params.applicationId))
  },

  async surfaceRight(params: GetSurfaceRightContractParams) {
    // --------------------------------------------------
    // [R02E-07][GET - /api/registry/applications/{applicationId}/contracts/surface-right] 지상권설정 계약정보 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_CONTRACT.SURFACE_RIGHT(params.applicationId))
  },

  async save4(params: SaveSurfaceRightContractParams) {
    // --------------------------------------------------
    // [R02E-08][PUT - /api/registry/applications/{applicationId}/contracts/surface-right] 지상권설정 계약정보 저장
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_CONTRACT.SAVE_4(params.applicationId))
  }
}
