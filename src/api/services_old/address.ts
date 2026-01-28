import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetAddressSuggestionsQuery,
  GetRegistryOfficesQuery,
  SearchAddressesQuery
} from '@/types'

// ✅ apiHelpers.get이 반환하는 실제 구조 (전체 API 응답)
interface AddressSearchResponseWrapper {
  status: number
  code: string
  title: string
  message: string
  data: {
    items?: Array<{
      roadAddress?: string
      jibunAddress?: string
    }>
    scroll?: {
      lastCursorId?: number
      hasNext?: boolean
      nextCursorId?: number
      pageSize?: number
    }
  }
}

interface AddressAutocompleteResponseWrapper {
  status: number
  code: string
  title: string
  message: string
  data: {
    suggestions?: string[]
  }
}

interface RegistryOfficeResponseWrapper {
  status: number
  code: string
  title: string
  message: string
  data: {
    registryOffices?: Array<{
      id?: number
      name?: string
      jurisdictionArea?: string
    }>
    pageInfo?: {
      pageNumber?: number
      pageSize?: number
      totalElements?: number
      totalPages?: number
    }
  }
}

export const addressAPI = {
  /**
   * [A01-01] 주소 검색
   */
  async search(params: SearchAddressesQuery) {
    return apiHelpers.get<AddressSearchResponseWrapper>(API.ADDRESS.SEARCH, params)
  },

  /**
   * [A01-02] 주소 자동완성
   */
  async suggestions(params: GetAddressSuggestionsQuery) {
    return apiHelpers.get<AddressAutocompleteResponseWrapper>(API.ADDRESS.SUGGESTIONS, params)
  },

  /**
   * [A01-03] 등기소 목록 조회
   */
  async getRegistryOffices(keyword: string = '', size: number = 50) {
    return apiHelpers.get<RegistryOfficeResponseWrapper>(API.ADDRESS.REGISTRY_OFFICES, {
      keyword,
      size
    } as GetRegistryOfficesQuery)
  }
}
