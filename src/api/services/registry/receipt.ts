// --------------------------------------------------
// [R02U] 접수
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetApplicationReceiptsParams,
  GetApplicationReceiptsResponse,
  GetDetailedApplicationReceiptsParams,
  GetDetailedApplicationReceiptsResponse,
  UpdateApplicationReceiptsParams,
  UpdateApplicationReceiptsRequest,
  UpdateApplicationReceiptsResponse
} from '@/types'

export const registryReceiptAPI = {
  async getList(params: GetApplicationReceiptsParams) {
    // --------------------------------------------------
    // [R02U-01][GET - /api/registry/applications/{registryManagementNumber}/receipts/list] 등기접수 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetApplicationReceiptsResponse>(
      API.REGISTRY_RECEIPT.LIST(params.registryManagementNumber)
    )
  },

  async update(params: UpdateApplicationReceiptsParams, data: UpdateApplicationReceiptsRequest) {
    // --------------------------------------------------
    // [R02U-02][PATCH - /api/registry/applications/{registryManagementNumber}/receipts] 등기접수 수정
    // --------------------------------------------------
    return apiHelpers.patch<UpdateApplicationReceiptsResponse>(
      API.REGISTRY_RECEIPT.UPDATE(params.registryManagementNumber),
      data
    )
  },

  async getDetail(params: GetDetailedApplicationReceiptsParams) {
    // --------------------------------------------------
    // [R02U-03][GET - /api/registry/applications/{registryManagementNumber}/receipts/detail] 등기접수 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDetailedApplicationReceiptsResponse>(
      API.REGISTRY_RECEIPT.DETAIL(params.registryManagementNumber)
    )
  }
}
