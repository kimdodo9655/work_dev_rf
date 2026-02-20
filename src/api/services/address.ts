// --------------------------------------------------
// [A01] 주소/등기소
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetAddressSuggestionsQuery,
  GetAddressSuggestionsResponse,
  GetRegistryOfficesQuery,
  GetRegistryOfficesResponse,
  SearchAddressesQuery,
  SearchAddressesResponse
} from '@/types'

export const addressAPI = {
  async search(query: SearchAddressesQuery) {
    // --------------------------------------------------
    // [A01-01][GET - /api/addresses] 주소 검색
    // --------------------------------------------------
    return apiHelpers.get<SearchAddressesResponse>(API.ADDRESS.SEARCH, query)
  },

  async suggestions(query: GetAddressSuggestionsQuery) {
    // --------------------------------------------------
    // [A01-02][GET - /api/addresses/suggestions] 주소 자동완성
    // --------------------------------------------------
    return apiHelpers.get<GetAddressSuggestionsResponse>(API.ADDRESS.SUGGESTIONS, query)
  },

  async registryOffices(query: GetRegistryOfficesQuery) {
    // --------------------------------------------------
    // [A01-03][GET - /api/registry-offices] 등기소 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryOfficesResponse>(API.ADDRESS.REGISTRY_OFFICES, query)
  }
}
