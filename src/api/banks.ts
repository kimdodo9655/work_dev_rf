import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { ApiResponse, Bank, BankList } from '@/types'

export const banksAPI = {
  /**
   * 금융기관 목록 조회
   * @returns 금융기관 목록
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await banksAPI.getList()
   * console.log(response.data) // Bank[]
   */
  async getList() {
    return apiHelpers.get<ApiResponse<BankList>>(API.BANK.LIST)
  },

  /**
   * 금융기관 상세 조회
   * @param code - 금융기관 코드
   * @returns 금융기관 상세 정보
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await banksAPI.getDetail('001')
   * console.log(response.data) // Bank
   */
  async getDetail(code: string) {
    return apiHelpers.get<ApiResponse<Bank>>(API.BANK.DETAIL(code))
  }
}
