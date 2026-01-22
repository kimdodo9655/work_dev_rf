/**
 * 부동산 및 세금 관련 타입 정의
 * @file src/types/domains/registry/property-tax.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 부동산 항목
 * Schema: PropertyItem
 */
export interface PropertyItem {
  /** 부동산 ID */
  propertyId: number
  /** 부동산 구분 */
  propertyType: string
  /** 주소 */
  address: string
  /** 지번 */
  lotNumber: string
  /** 면적 */
  area?: number
  /** 공시지가/공시가격 */
  officialPrice?: number
}

/**
 * 부동산 상세 응답
 * Schema: RegistryApplicationPropertyResponse
 * API: GET /api/registry/applications/{applicationId}/properties
 */
export interface RegistryApplicationPropertyResponse {
  /** 부동산 목록 */
  properties: PropertyItem[]
  /** 부동산 고유번호 옵션 */
  propertyUniqueNumberOptions: PropertyUniqueNumberOption[]
}

/**
 * 부동산 고유번호 옵션
 * Schema: PropertyUniqueNumberOption
 */
export interface PropertyUniqueNumberOption {
  /** 고유번호 */
  uniqueNumber: string
  /** 부동산 표시 */
  description: string
}

/**
 * 부동산 대체 요청
 * Schema: RegistryApplicationPropertyReplaceRequest
 * API: PUT /api/registry/applications/{applicationId}/properties
 */
export interface PropertyReplaceRequest {
  /** 부동산 목록 */
  properties: PropertyItem[]
}

/**
 * 소유권이전 세금 정보
 * Schema: OwnershipTaxResponse
 * API: GET /api/registry/applications/{applicationId}/ownership/tax
 */
export interface OwnershipTaxResponse {
  /** 세금 정보 */
  taxInfo?: TaxInfoResponse
  /** 국민주택채권 */
  bondProperty?: BondPropertyResponse
  /** 인지세 */
  stampTax?: StampTaxResponse
  /** 등기신청수수료 */
  filingFee?: FilingFeeResponse
}

/**
 * 세금 정보 요청
 * Schema: TaxInfoRequest
 */
export interface TaxInfoRequest {
  /** 취득세 */
  acquisitionTax: number
  /** 지방교육세 */
  educationTax: number
  /** 농어촌특별세 */
  ruralSpecialTax: number
  /** 등록면허세 */
  registrationLicenseTax: number
}

/**
 * 세금 정보 응답
 * Schema: TaxInfoResponse
 */
export interface TaxInfoResponse {
  /** 취득세 */
  acquisitionTax: number
  /** 지방교육세 */
  educationTax: number
  /** 농어촌특별세 */
  ruralSpecialTax: number
  /** 등록면허세 */
  registrationLicenseTax: number
  /** 합계 */
  totalTax: number
}

/**
 * 국민주택채권 요청
 * Schema: BondPropertyRequest (추정)
 */
export interface BondPropertyRequest {
  /** 채권 금액 */
  bondAmount: number
  /** 매도 금액 */
  saleAmount?: number
}

/**
 * 국민주택채권 응답
 * Schema: BondPropertyResponse
 */
export interface BondPropertyResponse {
  /** 채권 금액 */
  bondAmount: number
  /** 매도 금액 */
  saleAmount?: number
  /** 차액 */
  difference?: number
}

/**
 * 인지세 요청
 * Schema: StampTaxRequest
 */
export interface StampTaxRequest {
  /** 인지세 금액 */
  amount: number
}

/**
 * 인지세 응답
 * Schema: StampTaxResponse
 */
export interface StampTaxResponse {
  /** 인지세 금액 */
  amount: number
}

/**
 * 등기신청수수료 요청
 * Schema: FilingFeeRequest
 */
export interface FilingFeeRequest {
  /** 수수료 금액 */
  amount: number
}

/**
 * 등기신청수수료 응답
 * Schema: FilingFeeResponse
 */
export interface FilingFeeResponse {
  /** 수수료 금액 */
  amount: number
}

/**
 * 소유권이전 세금 저장 요청
 * API: POST /api/registry/applications/{applicationId}/ownership/tax
 */
export interface OwnershipTaxSaveRequest {
  /** 세금 정보 */
  taxInfo?: TaxInfoRequest
  /** 국민주택채권 */
  bondProperty?: BondPropertyRequest
  /** 인지세 */
  stampTax?: StampTaxRequest
  /** 등기신청수수료 */
  filingFee?: FilingFeeRequest
}

/**
 * 근저당권 채권/세금 정보
 * Schema: MortgageFinancialResponse
 * API: GET /api/registry/applications/{applicationId}/mortgage/financial
 */
export interface MortgageFinancialResponse {
  /** 국민주택채권 */
  bondProperty?: BondPropertyResponse
  /** 등록면허세 */
  registrationLicenseTax?: number
  /** 지방교육세 */
  educationTax?: number
  /** 인지세 */
  stampTax?: StampTaxResponse
  /** 등기신청수수료 */
  filingFee?: FilingFeeResponse
}

/**
 * 근저당권 채권/세금 저장 요청
 * API: POST /api/registry/applications/{applicationId}/mortgage/financial
 */
export interface MortgageFinancialSaveRequest {
  /** 국민주택채권 */
  bondProperty?: BondPropertyRequest
  /** 등록면허세 */
  registrationLicenseTax?: number
  /** 지방교육세 */
  educationTax?: number
  /** 인지세 */
  stampTax?: StampTaxRequest
  /** 등기신청수수료 */
  filingFee?: FilingFeeRequest
}
