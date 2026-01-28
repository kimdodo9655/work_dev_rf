/**
 * ADDRESS API Types
 * @generated 2025-01-27
 */

/**
 * A01-01
 * GET /api/addresses
 */
export interface SearchAddressesQuery {
  /** 검색 키워드 */
  keyword: string
  /** 커서 기반 페이지네이션을 위한 마지막 주소 ID (첫 요청 시 null 또는 생략) */
  cursorId?: number | null
  /** 한 번에 불러올 개수 */
  size?: number
}

export type SearchAddressesResponse = AddressSearchResponseSwagger

/**
 * A01-02
 * GET /api/addresses/suggestions
 */
export interface GetAddressSuggestionsQuery {
  /** 검색 키워드 */
  keyword: string
  /** 최대 결과 수 (최대 5개) */
  limit?: number
}

export type GetAddressSuggestionsResponse = AddressAutocompleteResponseSwagger

/**
 * A01-03
 * GET /api/registry-offices
 */
export interface GetRegistryOfficesQuery {
  /** 검색 키워드 (시도/등기소명) */
  keyword: string
  /** 한 번에 불러올 개수 */
  size: number
}

export type GetRegistryOfficesResponse = RegistryOfficeResponse

// ==================== Schemas ====================

/** 주소 자동완성 응답 */
export interface AddressAutocompleteResponse {
  /** 자동완성 제안 목록 */
  suggestions?: string[]
}

/** ApiResult 형태의 주소 자동완성 응답 예시 */
export interface AddressAutocompleteResponseSwagger {
  /** 상태 코드 */
  status?: number
  /** 응답 코드 */
  code?: string
  /** 타이틀 */
  title?: string
  /** 메시지 */
  message?: string
  data?: AddressAutocompleteResponse
}

/** 주소 항목 */
export interface AddressItem {
  roadAddress?: string
  jibunAddress?: string
}

/** 주소 검색 응답 */
export interface AddressSearchResponse {
  items?: AddressItem[]
  scroll?: ScrollInfo
}

/** ApiResult 형태의 주소 검색 응답 예시 */
export interface AddressSearchResponseSwagger {
  /** 상태 코드 */
  status?: number
  /** 응답 코드 */
  code?: string
  /** 타이틀 */
  title?: string
  /** 메시지 */
  message?: string
  data?: AddressSearchResponse
}

/** 페이징 정보 */
export interface PageInfo {
  /** 현재 페이지 번호 */
  pageNumber?: number
  /** 페이지 크기 */
  pageSize?: number
  /** 전체 항목 수 */
  totalElements?: number
  /** 전체 페이지 수 */
  totalPages?: number
}

/** 등기소검색 상세 항목 */
export interface RegistryOfficeDetailResponse {
  /** 등기소 고유번호 */
  id?: number
  /** 등기소 명칭 */
  name?: string
  /** 관할 지역 */
  jurisdictionArea?: string
}

/** 등기소검색 응답 */
export interface RegistryOfficeResponse {
  /** 등기소 리스트 */
  registryOffices?: RegistryOfficeDetailResponse[]
  pageInfo?: PageInfo
}

/** 무한 스크롤 정보 */
export interface ScrollInfo {
  lastCursorId?: number
  hasNext?: boolean
  nextCursorId?: number
  pageSize?: number
}
