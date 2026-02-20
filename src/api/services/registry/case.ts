// --------------------------------------------------
// [R02T] 사건
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetDetailedRegistryProgressCaseInquirysParams,
  GetDetailedRegistryProgressCaseInquirysResponse,
  GetProgressCaseInquirysParams,
  GetProgressCaseInquirysResponse,
  UpdateRegistryProgressCaseInquirysParams,
  UpdateRegistryProgressCaseInquirysRequest,
  UpdateRegistryProgressCaseInquirysResponse
} from '@/types'

export const registryCaseAPI = {
  async getList(params: GetProgressCaseInquirysParams) {
    // --------------------------------------------------
    // [R02T-01][GET - /api/registry/progress/{registryManagementNumber}/case-inquiries/list] 신청사건 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProgressCaseInquirysResponse>(
      API.REGISTRY_CASE.LIST(params.registryManagementNumber)
    )
  },

  async update(
    params: UpdateRegistryProgressCaseInquirysParams,
    data: UpdateRegistryProgressCaseInquirysRequest
  ) {
    // --------------------------------------------------
    // [R02T-02][PATCH - /api/registry/progress/{registryManagementNumber}/case-inquiries] 신청사건 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateRegistryProgressCaseInquirysResponse>(
      API.REGISTRY_CASE.UPDATE(params.registryManagementNumber),
      data
    )
  },

  async getDetail(params: GetDetailedRegistryProgressCaseInquirysParams) {
    // --------------------------------------------------
    // [R02T-03][GET - /api/registry/progress/{registryManagementNumber}/case-inquiries/detail] 신청사건 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedRegistryProgressCaseInquirysResponse>(
      API.REGISTRY_CASE.DETAIL(params.registryManagementNumber)
    )
  }
}
