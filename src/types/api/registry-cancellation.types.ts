/**
 * REGISTRY_CANCELLATION API Types
 * @generated 2025-01-27
 */

import type { ContractPartyResponse, RegistryApplicationPartyReplaceRequest } from './common.types'

/**
 * R02M-01
 * GET /api/registry/applications/{applicationId}/cancellations
 */
export interface GetRegistryApplicationCancellationDetailParams {
  /** 신청서ID */
  applicationId: number
}

export type GetRegistryApplicationCancellationDetailResponse =
  RegistryApplicationCancellationResponse

/**
 * R02M-02
 * PUT /api/registry/applications/{applicationId}/cancellations
 */
export interface SaveRegistryApplicationCancellationsParams {
  /** 신청서ID */
  applicationId: number
}

export type SaveRegistryApplicationCancellationsRequest =
  RegistryApplicationCancellationReplaceRequest

export type SaveRegistryApplicationCancellationsResponse = RegistryApplicationCancellationResponse

// ==================== Schemas ====================

/** 말소사항 정보 목록 */
export interface CancellationItemRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 선순위 설정 금융기관 */
  seniorMortgageBank: string
  /** 선순위 설정 취급지점 */
  seniorMortgageBranch: string
  /** 순위번호 */
  rankNumber: string
  /** 설정 접수 일자 */
  establishmentReceiptDate: string
  /** 설정 접수 번호 */
  establishmentReceiptNumber: string
  /** 채권최고액 */
  maximumCreditAmount: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject?: string
}

/** 말소사항 정보 */
export interface RegistryApplicationCancellationItemResponse {
  /** 말소사항 ID */
  cancellationId?: number
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 선순위 설정 금융기관 */
  seniorMortgageBank?: string
  /** 선순위 설정 취급지점 */
  seniorMortgageBranch?: string
  /** 해당구 */
  section?: 'GAP' | 'EUL'
  /** 해당구 한글명 */
  sectionDescription?: string
  /** 순위번호 */
  rankNumber?: string
  /** 설정 접수 일자 */
  establishmentReceiptDate?: string
  /** 설정 접수 번호 */
  establishmentReceiptNumber?: string
  /** 채권최고액 */
  maximumCreditAmount?: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject?: string
}

/** 부동산 고유번호 옵션 */
export interface RegistryApplicationCancellationPropertyOption {
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 부동산 주소 */
  propertyAddress?: string
}

/** 말소사항 정보 조회 응답 */
export interface RegistryApplicationCancellationResponse {
  contractParties?: ContractPartyResponse
  /** 기본 항목 (동적 object) */
  basicItems?: Record<string, unknown>
  /** 부동산 선택 옵션 */
  propertyOptions?: RegistryApplicationCancellationPropertyOption[]
  /** 선순위 대출 후보 목록 */
  seniorLoanCandidates?: RegistryApplicationCancellationSeniorLoanResponse[]
  /** 말소사항 목록 */
  cancellations?: RegistryApplicationCancellationItemResponse[]
}

/** 말소사항 정보 대체 요청 */
export interface RegistryApplicationCancellationReplaceRequest {
  partyRequest?: RegistryApplicationPartyReplaceRequest
  /** 등기원인일자 */
  registryCauseDate?: string
  /** 말소사항 정보 목록 */
  cancellationItems: CancellationItemRequest[]
}

/** 선순위 대출 상환 정보 */
export interface RegistryApplicationCancellationSeniorLoanResponse {
  /** 선순위대출 ID */
  seniorLoanId?: number
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 해당구 */
  section?: 'GAP' | 'EUL'
  /** 해당구 한글명 */
  sectionDescription?: string
  /** 순위번호 */
  rankNumber?: string
  /** 설정 금융기관 */
  rightHolderName?: string
  /** 설정 취급지점 */
  rightHolderBranch?: string
  /** 설정 접수 일자 */
  receiptDate?: string
  /** 설정 접수 번호 */
  receiptNumber?: string
  /** 채권최고액 */
  maximumCreditAmount?: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject?: string
}
