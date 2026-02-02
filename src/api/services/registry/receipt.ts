// --------------------------------------------------
// [R02U] 접수
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetApplicationReceiptsParams,
  GetDetailedApplicationReceiptsParams,
  UpdateApplicationReceiptsParams
} from '@/types'

export const registryReceiptAPI = {
  async getList(params: GetApplicationReceiptsParams) {
    // --------------------------------------------------
    // [R02U-01][GET - /api/registry/applications/{registryManagementNumber}/receipts/list] 등기접수 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_RECEIPT.LIST(params.registryManagementNumber))
  },

  async update(params: UpdateApplicationReceiptsParams) {
    // --------------------------------------------------
    // [R02U-02][PATCH - /api/registry/applications/{registryManagementNumber}/receipts] 등기접수 수정
    // --------------------------------------------------
    return apiHelpers.patch(API.REGISTRY_RECEIPT.UPDATE(params.registryManagementNumber))
  },

  async getDetail(params: GetDetailedApplicationReceiptsParams) {
    // --------------------------------------------------
    // [R02U-03][GET - /api/registry/applications/{registryManagementNumber}/receipts/detail] 등기접수 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_RECEIPT.DETAIL(params.registryManagementNumber))
  }
}
