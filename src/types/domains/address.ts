/**
 * 주소 검색 관련 타입 정의
 * @file src/types/domains/address.ts
 */

/**
 * 주소 항목
 */
export interface AddressItem {
  roadAddress: string // 도로명 주소
  jibunAddress: string // 지번 주소
}

/**
 * 스크롤 정보 (커서 기반 페이지네이션)
 */
export interface ScrollInfo {
  lastCursorId: number | null // 마지막 커서 ID
  nextCursorId: number | null // 다음 커서 ID
  hasNext: boolean // 다음 페이지 존재 여부
  pageSize: number // 페이지 크기
}

/**
 * 주소 검색 응답
 */
export interface AddressSearchResponse {
  items: AddressItem[] // 주소 목록
  scroll: ScrollInfo // 스크롤 정보
}

/**
 * 주소 검색 파라미터
 */
export interface AddressSearchParams {
  keyword: string // 검색 키워드
  cursorId?: number | null // 커서 ID (다음 페이지 조회 시)
  size?: number // 페이지 크기 (기본값: 20)
}

/**
 * 주소 자동완성 응답
 */
export interface AddressAutocompleteResponse {
  suggestions: string[] // 자동완성 제안 목록 (최대 5개)
}

/**
 * 주소 자동완성 파라미터
 */
export interface AddressAutocompleteParams {
  keyword: string // 검색 키워드
  limit?: number // 제안 개수 (기본값: 5, 최대: 5)
}

/**
 * 등기소 정보
 */
export interface RegistryOffice {
  id: number // 등기소 고유번호
  name: string // 등기소명
  jurisdictionArea: string // 관할 지역
}

/**
 * 페이지 정보
 */
export interface PageInfo {
  currentPage: number // 현재 페이지
  size: number // 페이지 크기
  totalElements: number // 전체 요소 개수
  totalPages: number // 전체 페이지 수
  hasNext: boolean // 다음 페이지 존재 여부
}

/**
 * 등기소 목록 응답
 * API 응답 구조: { registryOffices: RegistryOffice[], pageInfo: PageInfo }
 */
export interface RegistryOfficeList {
  registryOffices: RegistryOffice[] // 등기소 목록
  pageInfo: PageInfo // 페이지 정보
}
