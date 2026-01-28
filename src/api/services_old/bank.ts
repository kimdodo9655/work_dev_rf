import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { ApiResponse, GetBankResponse, GetBanksResponse } from '@/types'

export const bankAPI = {
  /**
   * 금융기관 목록 조회
   * @returns 금융기관 목록
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await bankAPI.getList()
   * console.log(response.data) // BankResponse[]
   */
  async getList() {
    return apiHelpers.get<ApiResponse<GetBanksResponse>>(API.BANK.LIST)
  },

  /**
   * 금융기관 상세 조회
   * @param code - 금융기관 코드
   * @returns 금융기관 상세 정보
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await bankAPI.getDetail('001')
   * console.log(response.data) // BankResponse
   */
  async getDetail(code: string) {
    return apiHelpers.get<ApiResponse<GetBankResponse>>(`${API.BANK.LIST}/${code}`)
  }
}
