// --------------------------------------------------
// [R02P] 세금신고
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetTaxAgenciesParams,
  GetTaxAgencyListParams,
  ReplaceTaxAgenciesParams
} from '@/types'

export const registryTaxReportAPI = {
  async getDetail(params: GetTaxAgenciesParams) {
    // --------------------------------------------------
    // [R02P-01][GET - /api/registry/progress/{registryManagementNumber}/tax-agencies/detail] 세금신고 대행 상세 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_TAX_REPORT.DETAIL(params.registryManagementNumber))
  },

  async getList(params: GetTaxAgencyListParams) {
    // --------------------------------------------------
    // [R02P-02][GET - /api/registry/progress/{registryManagementNumber}/tax-agencies/list] 세금신고 대행 목록 조회
    // --------------------------------------------------
    return apiHelpers.get(API.REGISTRY_TAX_REPORT.LIST(params.registryManagementNumber))
  },

  async list2(params: ReplaceTaxAgenciesParams) {
    // --------------------------------------------------
    // [R02P-03][PUT - /api/registry/progress/{registryManagementNumber}/tax-agencies] 세금신고 대행 목록 대체
    // --------------------------------------------------
    return apiHelpers.put(API.REGISTRY_TAX_REPORT.LIST_2(params.registryManagementNumber))
  }
}
