import type { ApiResponse, Bank, BankList } from '@/types'

import { apiHelpers } from './client'
import { API } from './endpoints'

export const banksAPI = {
  // 금융기관 목록 조회
  async getList() {
    return apiHelpers.get<ApiResponse<BankList>>(API.BANKS.LIST)
  },

  // 금융기관 상세 조회
  async getDetail(code: string) {
    return apiHelpers.get<ApiResponse<Bank>>(API.BANKS.DETAIL(code))
  }
}
