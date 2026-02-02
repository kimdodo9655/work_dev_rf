// --------------------------------------------------
// [P05] 금융기관
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { GetBankParams, GetBankResponse, GetBanksResponse } from '@/types'

export const bankAPI = {
  async getList() {
    // --------------------------------------------------
    // [P05-01][GET - /api/banks] 금융기관 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBanksResponse>(API.BANK.LIST)
  },

  async getDetail(params: GetBankParams) {
    // --------------------------------------------------
    // [P05-02][GET - /api/banks/{code}] 금융기관 상세 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBankResponse>(API.BANK.DETAIL(params.code))
  }
}
