// --------------------------------------------------
// [R02N] 행정동의
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetApplicationAdminInfoRequestsParams,
  GetApplicationAdminInfoRequestsResponse,
  GetDetailedApplicationAdminInfoRequestsParams,
  GetDetailedApplicationAdminInfoRequestsResponse,
  UpdateApplicationAdminInfoRequestsParams,
  UpdateApplicationAdminInfoRequestsRequest,
  UpdateApplicationAdminInfoRequestsResponse
} from '@/types'

export const registryAdminConsentAPI = {
  async getList(params: GetApplicationAdminInfoRequestsParams) {
    // --------------------------------------------------
    // [R02N-01][GET - /api/registry/progress/{registryManagementNumber}/admin-info-requests/list] 행정정보사전동의서 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetApplicationAdminInfoRequestsResponse>(
      API.REGISTRY_ADMIN_CONSENT.LIST(params.registryManagementNumber)
    )
  },

  async update(
    params: UpdateApplicationAdminInfoRequestsParams,
    data: UpdateApplicationAdminInfoRequestsRequest
  ) {
    // --------------------------------------------------
    // [R02N-02][PATCH - /api/registry/progress/{registryManagementNumber}/admin-info-requests] 행정정보사전동의서 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateApplicationAdminInfoRequestsResponse>(
      API.REGISTRY_ADMIN_CONSENT.UPDATE(params.registryManagementNumber),
      data
    )
  },

  async getDetail(params: GetDetailedApplicationAdminInfoRequestsParams) {
    // --------------------------------------------------
    // [R02N-03][GET - /api/registry/progress/{registryManagementNumber}/admin-info-requests/detail] 행정정보사전동의서 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedApplicationAdminInfoRequestsResponse>(
      API.REGISTRY_ADMIN_CONSENT.DETAIL(params.registryManagementNumber)
    )
  }
}
