/**
 * REGISTRY_CASE API Types
 * @generated 2025-01-27
 */

/**
 * R02T-01
 * GET /api/registry/progress/{registryManagementNumber}/case-inquiries/list
 */
export interface GetProgressCaseInquirysParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetProgressCaseInquirysResponse = RegistryProgressCaseInquiryListResponse

/**
 * R02T-02
 * PATCH /api/registry/progress/{registryManagementNumber}/case-inquiries
 */
export interface UpdateRegistryProgressCaseInquirysParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type UpdateRegistryProgressCaseInquirysRequest = RegistryProgressCaseInquiryRequest

export type UpdateRegistryProgressCaseInquirysResponse = string

/**
 * R02T-03
 * GET /api/registry/progress/{registryManagementNumber}/case-inquiries/detail
 */
export interface GetDetailedRegistryProgressCaseInquirysParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetDetailedRegistryProgressCaseInquirysResponse = RegistryProgressCaseInquiryResponse

// ==================== Schemas ====================

/** 등기 신청사건 조회 정보 - 부동산 정보 */
export interface CaseInquiryItem {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 부동산구분 */
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  /** 등기신청인 구분 */
  partyRole?: string
  /** 소유자 이름 */
  ownerName?: string
  /** 부동산주소 */
  propertyAddress?: string
  /** 처리결과 목록 */
  results?: CaseInquiryResultWrapperItem[]
}

/** 등기 신청사건 목록 정보 */
export interface CaseInquiryListItem {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 부동산구분 */
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  /** 부동산표시 */
  propertyAddress?: string
  /** 등기유형 목록 */
  registryTypes?: string[]
}

/** 등기 신청사건 조회 정보 - 처리결과 목록 */
export interface CaseInquiryResultWrapperItem {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 조회일자 */
  createdAt?: string
  /** 등기유형 */
  registryType?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기진행상태 */
  registryProgressStatus?: string
  /** 사유 */
  reason?: string
}

/** 등기 신청사건 목록 조회 응답 */
export interface RegistryProgressCaseInquiryListResponse {
  /** 신청사건 목록 */
  caseInquiry?: CaseInquiryListItem[]
}

/** 등기 신청사건 등록 요청 */
export interface RegistryProgressCaseInquiryRequest {
  /** 등기신청사건 정보 목록 */
  caseInquiryItems: CaseInquiryItem[]
}

/** 등기 신청사건 상세 조회 정보 */
export interface RegistryProgressCaseInquiryResponse {
  /** 신청사건 정보 */
  caseInquiry?: CaseInquiryItem[]
}
