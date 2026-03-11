/**
 * 문서 경로: `@/src/types/api/registry-tax-report.types.ts`
 * 문서 제목: 타입 정의: registry-tax-report-types
 */

/**
 * REGISTRY_TAX_REPORT API Types
 * @generated 2025-01-27
 */

import type {
  PropertyInfo,
  RegistryProgressTaxInfoResponse,
  TaxInfoWithNumbersRequest
} from './common.types'

/**
 * R02P-01
 * GET /api/registry/progress/{registryManagementNumber}/tax-agencies/detail
 */
export interface GetTaxAgenciesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetTaxAgenciesResponse = RegistryProgressTaxAgencyListResponse

/**
 * R02P-02
 * GET /api/registry/progress/{registryManagementNumber}/tax-agencies/list
 */
export interface GetTaxAgencyListParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetTaxAgencyListResponse = RegistryProgressTaxAgencyTableResponse

/**
 * R02P-03
 * PUT /api/registry/progress/{registryManagementNumber}/tax-agencies
 */
export interface ReplaceTaxAgenciesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type ReplaceTaxAgenciesRequest = RegistryProgressTaxAgencyReplaceRequest

export type ReplaceTaxAgenciesResponse = RegistryProgressTaxAgencyListResponse

// ==================== Schemas ====================

/** 세금신고 대행 카드 정보 */
export interface RegistryProgressTaxAgencyItemResponse {
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  inputInfo?: RegistryProgressTaxAgencyInputInfoResponse
  taxInfo?: RegistryProgressTaxInfoResponse
}

/** 세금신고 대행 목록 응답 */
export interface RegistryProgressTaxAgencyListResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 세금신고 대행 카드 목록 */
  items?: RegistryProgressTaxAgencyItemResponse[]
}

/** 세금신고 대행 목록 대체 요청 */
export interface RegistryProgressTaxAgencyReplaceRequest {
  /** 세금신고 대행 항목 목록 */
  items: RegistryProgressTaxAgencyReplaceRequestItem[]
}

/** 세금신고 대행 항목 */
export interface RegistryProgressTaxAgencyReplaceRequestItem {
  /** 신청서 ID */
  applicationId: number
  tax: TaxInfoWithNumbersRequest
}

/** 구비서류 정보 */
export interface AttachmentInfo {
  /** 위임장 파일명 (JPG) */
  powerOfAttorneyFileName?: string
}

/** 등록원인 정보 */
export interface RegistryCauseInfo {
  /** 물건종류 */
  propertyType?: string
  /** 물건상세 */
  propertyDetail?: string
  /** 등록원인 */
  registryCause?: string
}

/** 납세자 정보 */
export interface TaxPayer {
  /** 성명 */
  name?: string
  /** 법인명 (법인일 경우) */
  corporationName?: string
  /** 공동명의 구분 */
  jointOwnershipType?: string
  /** 주민등록번호/법인등록번호 */
  registrationNumber?: string
  /** 사업자등록번호 */
  businessRegistrationNumber?: string
  /** 휴대전화번호 */
  mobile?: string
  /** 주소 */
  address?: string
}

/** 세금신고 대행 입력정보 */
export interface RegistryProgressTaxAgencyInputInfoResponse {
  taxpayer?: TaxPayer
  registryCause?: RegistryCauseInfo
  property?: PropertyInfo
  attachment?: AttachmentInfo
}

/** 세금신고 대행 작업 프로세스 테이블 응답 */
export interface RegistryProgressTaxAgencyTableResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 세금신고 대행 테이블 행 목록 */
  rows?: Row[]
}

/** 세금신고 대행 테이블 행 정보 */
export interface Row {
  /** 신청서 ID */
  applicationId?: number
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기유형 명 */
  registryTypeName?: string
  /** 매입구분 */
  purchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  /** 매입대상금액 */
  purchaseTargetAmount?: number
  /** 채권매입금액 */
  bondPurchaseAmount?: number
  /** 채권할인금액 */
  bondDiscountAmount?: number
  /** 국민주택채권번호 */
  housingBondNumber?: string
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  /** 납부 상태 명 */
  paymentStatusName?: string
  /** 납부 금액 */
  paymentAmount?: number
  /** 납세 번호 */
  taxNumber?: string
  /** 전자납부 번호 */
  electronicPaymentNumber?: string
}
