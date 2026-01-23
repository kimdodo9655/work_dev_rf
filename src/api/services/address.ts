import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  AddressAutocompleteParams,
  AddressAutocompleteResponse,
  AddressSearchParams,
  AddressSearchResponse,
  ApiResponse,
  RegistryOfficeList
} from '@/types'

export const addressAPI = {
  /**
   * [A01-01] 주소 검색
   * @param params - 검색 파라미터 (keyword, cursorId, size)
   * @returns 주소 검색 결과 (페이지네이션 지원)
   * @throws {ApiError} 검색 실패 시
   *
   * @example
   * const response = await addressAPI.search({
   *   keyword: '서울특별시 용산구',
   *   size: 20
   * })
   */
  async search(params: AddressSearchParams) {
    return apiHelpers.get<ApiResponse<AddressSearchResponse>>(API.ADDRESS.SEARCH, params)
  },

  /**
   * [A01-02] 주소 자동완성
   * @param params - 자동완성 파라미터 (keyword, limit)
   * @returns 자동완성 제안 목록 (최대 5개)
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await addressAPI.suggestions({
   *   keyword: '회나무로',
   *   limit: 5
   * })
   */
  async suggestions(params: AddressAutocompleteParams) {
    return apiHelpers.get<ApiResponse<AddressAutocompleteResponse>>(API.ADDRESS.SUGGESTIONS, params)
  },

  /**
   * [A01-03] 등기소 목록 조회
   * @param keyword - 검색 키워드 (필수)
   * @returns 등기소 목록
   * @throws {ApiError} 조회 실패 시
   *
   * @example
   * const response = await addressAPI.getRegistryOffices('서울')
   * console.log(response.data) // RegistryOffice[]
   */
  async getRegistryOffices(keyword: string = '', size: number = 50) {
    return apiHelpers.get<ApiResponse<RegistryOfficeList>>(API.ADDRESS.REGISTRY_OFFICES, {
      keyword,
      size
    })
  }
}
