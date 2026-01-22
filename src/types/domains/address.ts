/**
 * 주소 검색 관련 타입 정의
 * @file src/types/domains/address.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 주소 항목
 * Schema: AddressItem
 */
export interface AddressItem {
  /** 도로명 주소 */
  roadAddress: string
  /** 지번 주소 */
  jibunAddress: string
}

/**
 * 스크롤 정보 (커서 기반 페이지네이션)
 * Schema: ScrollInfo
 */
export interface ScrollInfo {
  /** 마지막 커서 ID */
  lastCursorId: number | null
  /** 다음 커서 ID */
  nextCursorId: number | null
  /** 다음 페이지 존재 여부 */
  hasNext: boolean
  /** 페이지 크기 */
  pageSize: number
}

/**
 * 주소 검색 응답
 * Schema: AddressSearchResponse
 */
export interface AddressSearchResponse {
  /** 주소 목록 */
  items: AddressItem[]
  /** 스크롤 정보 */
  scroll: ScrollInfo
}

/**
 * 주소 검색 파라미터 (요청)
 * OpenAPI에는 없지만 프론트엔드 전용 타입
 */
export interface AddressSearchParams {
  /** 검색 키워드 */
  keyword: string
  /** 커서 ID (다음 페이지 조회 시) */
  cursorId?: number | null
  /** 페이지 크기 (기본값: 20) */
  size?: number
}

/**
 * 주소 자동완성 응답
 * Schema: AddressAutocompleteResponse
 */
export interface AddressAutocompleteResponse {
  /** 자동완성 제안 목록 (최대 5개) */
  suggestions: string[]
}

/**
 * 주소 자동완성 파라미터 (요청)
 * OpenAPI에는 없지만 프론트엔드 전용 타입
 */
export interface AddressAutocompleteParams {
  /** 검색 키워드 */
  keyword: string
  /** 제안 개수 (기본값: 5, 최대: 5) */
  limit?: number
}

/**
 * 페이지 정보
 * Schema: PageInfo
 *
 * 프로젝트 호환성을 위해 currentPage, size 별칭 추가
 */
export interface PageInfo {
  /** 현재 페이지 번호 */
  pageNumber: number
  /** 현재 페이지 번호 (별칭) */
  currentPage: number
  /** 페이지 크기 */
  pageSize: number
  /** 페이지 크기 (별칭) */
  size: number
  /** 전체 요소 수 */
  totalElements: number
  /** 전체 페이지 수 */
  totalPages: number
  /** 다음 페이지 존재 여부 */
  hasNext: boolean
}

/**
 * 등기소 정보
 * Schema: RegistryOfficeDetailResponse
 */
export interface RegistryOffice {
  /** 등기소 고유번호 */
  id: number
  /** 등기소명 */
  name: string
  /** 관할 지역 */
  jurisdictionArea: string
}

/**
 * 등기소 목록 응답
 * Schema: RegistryOfficeResponse
 */
export interface RegistryOfficeList {
  /** 등기소 목록 */
  registryOffices: RegistryOffice[]
  /** 페이지 정보 */
  pageInfo: PageInfo
}
