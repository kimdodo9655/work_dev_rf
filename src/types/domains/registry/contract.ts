/**
 * 계약 정보 관련 타입 정의
 * @file src/types/domains/registry/contract.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 계약당사자 상세 정보
 * Schema: ContractPartyDetail
 */
export interface ContractPartyDetail {
  /** 당사자 ID */
  partyId: number
  /** 성명/법인명 */
  name: string
  /** 주민등록번호/사업자등록번호 */
  registrationNumber: string
  /** 주소 */
  address: string
  /** 전화번호 */
  phone?: string
  /** 당사자 구분 */
  partyType: string
}

/**
 * 진행당사자 선택 옵션
 * Schema: ProgressPartyOption
 */
export interface ProgressPartyOption {
  /** 당사자 ID */
  partyId: number
  /** 성명/법인명 */
  name: string
  /** 당사자 구분 */
  partyType: string
}

/**
 * 계약당사자 목록 응답
 * Schema: ContractPartyResponse
 * API: GET /api/registry/applications/{applicationId}/contracts/parties
 */
export interface ContractPartyResponse {
  /** 등기권리자 목록 */
  obligees: ContractPartyDetail[]
  /** 등기의무자 목록 */
  obligors: ContractPartyDetail[]
  /** 채무자 목록 */
  debtors: ContractPartyDetail[]
  /** 진행당사자 선택 옵션 */
  progressPartyOptions: ProgressPartyOption[]
}

/**
 * 중도금 정보
 * Schema: InterimPayment
 */
export interface InterimPayment {
  /** 금액 */
  amount?: number
  /** 지급일자 */
  paymentDate?: string
}

/**
 * 중도금 정보 응답
 * Schema: InterimPaymentResponse
 */
export interface InterimPaymentResponse {
  /** 금액 */
  amount?: number
  /** 지급일자 */
  paymentDate?: string
}

/**
 * 소유권이전 계약정보 요청
 * Schema: OwnershipContractRequest
 * API: PUT /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface OwnershipContractRequest {
  /** 계약 일자 */
  contractDate: string
  /** 계약 금액 */
  contractAmount: number
  /** 1차 중도금 */
  firstInterim?: InterimPayment
  /** 2차 중도금 */
  secondInterim?: InterimPayment
  /** 등기접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
}

/**
 * 소유권이전 계약정보 응답
 * Schema: OwnershipContractResponse
 * API: GET /api/registry/applications/{applicationId}/contracts/ownership
 */
export interface OwnershipContractResponse {
  /** 계약 일자 */
  contractDate: string
  /** 계약 금액 */
  contractAmount: number
  /** 1차 중도금 */
  firstInterim?: InterimPaymentResponse
  /** 2차 중도금 */
  secondInterim?: InterimPaymentResponse
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 실거래신고 접수번호 */
  tradeReportReceiptNumber?: string
  /** 실거래신고 관리번호 */
  tradeReportManagementNumber?: string
}

/**
 * 피담보채무 범위 요청
 * Schema: SecuredDebtScopeRequest
 */
export interface SecuredDebtScopeRequest {
  /** 피담보채무 범위 설명 */
  description: string
}

/**
 * 피담보채무 범위 응답
 * Schema: SecuredDebtScopeResponse
 */
export interface SecuredDebtScopeResponse {
  /** 피담보채무 범위 ID */
  id: number
  /** 피담보채무 범위 설명 */
  description: string
}

/**
 * 근저당권설정 계약정보 요청
 * Schema: MortgageContractRequest
 * API: PUT /api/registry/applications/{applicationId}/contracts/mortgage
 */
export interface MortgageContractRequest {
  /** 계약 일자 */
  contractDate: string
  /** 채권 최고액 */
  maximumCreditAmount: number
  /** 피담보채무 범위 유형 */
  securedDebtScopeType: string
  /** 피담보채무 범위 목록 (최대 2건) */
  securedDebtScopes: SecuredDebtScopeRequest[]
  /** 결산기 유형 */
  settlementPeriodType?: string
  /** 결산 일자 */
  settlementDate?: string
  /** 대출 실행 일자 */
  loanExecutionDate?: string
  /** 철회권 포기 여부 */
  isWithdrawalRightWaived: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
}

/**
 * 근저당권설정 계약정보 응답
 * Schema: MortgageContractResponse
 * API: GET /api/registry/applications/{applicationId}/contracts/mortgage
 */
export interface MortgageContractResponse {
  /** 계약 일자 */
  contractDate: string
  /** 채권 최고액 */
  maximumCreditAmount: number
  /** 피담보채무 범위 구분 */
  securedDebtScopeType: string
  /** 피담보채무 범위 상세 */
  securedDebtScopes: SecuredDebtScopeResponse[]
  /** 결산기 유형 */
  settlementPeriodType?: string
  /** 결산 일자 */
  settlementDate?: string
  /** 대출 실행 일자 */
  loanExecutionDate?: string
  /** 철회권 포기 여부 */
  isWithdrawalRightWaived: boolean
  /** 철회권 포기 일자 */
  withdrawalRightWaiveDate?: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
}

/**
 * 지상권 당사자 옵션
 * Schema: SurfaceRightPartyOption
 */
export interface SurfaceRightPartyOption {
  /** 당사자 ID */
  partyId: number
  /** 성명/법인명 */
  name: string
}

/**
 * 지상권설정 계약정보 요청
 * Schema: SurfaceRightContractRequest
 * API: PUT /api/registry/applications/{applicationId}/contracts/surface-right
 */
export interface SurfaceRightContractRequest {
  /** 계약 일자 */
  contractDate: string
  /** 권리자 계약당사자 ID */
  obligeePartyId: number
  /** 의무자 계약당사자 ID */
  obligorPartyId: number
  /** 설정 목적 */
  establishmentPurpose: string
  /** 설정 범위 */
  establishmentScope: string
  /** 존속 기간 */
  durationPeriod: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
}

/**
 * 지상권설정 계약정보 응답
 * Schema: SurfaceRightContractResponse
 * API: GET /api/registry/applications/{applicationId}/contracts/surface-right
 */
export interface SurfaceRightContractResponse {
  /** 계약 일자 */
  contractDate: string
  /** 권리자 계약당사자 ID */
  obligeePartyId: number
  /** 의무자 계약당사자 ID */
  obligorPartyId: number
  /** 설정 목적 */
  establishmentPurpose: string
  /** 설정 범위 */
  establishmentScope: string
  /** 존속 기간 */
  durationPeriod: string
  /** 등기 접수 일자 */
  registryReceiptDate?: string
  /** 지상권 관련 당사자 옵션 */
  partyOptions: SurfaceRightPartyOption[]
}

/**
 * 계약당사자 일괄 저장 요청
 * API: PUT /api/registry/applications/{applicationId}/contracts/parties
 */
export interface ContractPartyReplaceRequest {
  /** 등기권리자 목록 */
  obligees: ContractPartyDetail[]
  /** 등기의무자 목록 */
  obligors: ContractPartyDetail[]
  /** 채무자 목록 */
  debtors: ContractPartyDetail[]
}
