/**
 * REGISTRY_TEST API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid } from './common.types'

/**
 * R00-01
 * POST /api/registry/test-data/requests
 */
export interface CreateRegistryRequestTestDataQuery {
  /** 후행법무대리인명칭 (Organization 테이블의 organization_name 값) */
  organizationName?: string
}

export type CreateRegistryRequestTestDataResponse = RegistryRequestTestDataResponse

/**
 * R00-02
 * POST /api/registry/test-data/progress
 */
export interface CreateRegistryProgressTestDataQuery {
  /** 등기신청번호 (등기의뢰 테스트 데이터 생성 API로 먼저 생성 필요) */
  registryRequestNumber: string
}

export type CreateRegistryProgressTestDataResponse = RegistryProgressTestDataResponse

/**
 * R00-03
 * POST /api/registry/test-data/scheduler/generate
 */
export type RunRegistryTestDataSchedulersResponse = ApiResultVoid

/**
 * R00-04
 * POST /api/registry/test-data/scheduler/generate-missing-progress
 */
export type RunGenerateMissingRegistryProgressDataSchedulerResponse = ApiResultVoid

/**
 * R00-05
 * POST /api/registry/test-data/scheduler/assign-managers
 */
export type RunRegistryManagerAssignmentSchedulerResponse = ApiResultVoid

/**
 * R00-06
 * POST /api/registry/test-data/combine
 */
export interface CreateRegistryTypeComboTestDataQuery {
  /** 법무대리인명칭 (Organization 테이블의 organization_name 값) */
  organizationName?: string
  /** 진행 유형 (ProgressType 코드값) */
  progressType: 'TYPE_01' | 'TYPE_02' | 'TYPE_04' | 'TYPE_05' | 'TYPE_07'
  /** 등기 방식 (RegistryMethod 코드값) */
  registryMethod: 'ELECTRONIC' | 'E_FORM' | 'PAPER' | 'MIXED'
  /** 부동산 개수 */
  numberOfProperties: number
  /** 부동산 추가 정보 생성 여부 */
  hasAdditionalPropertyInfo?: boolean
  /** 지상권 설정 부동산 수 */
  numberOfSurfaceRights?: number
  /** 담보제공자 수 */
  numberOfBuyers: number
  /** 담보제공자 추가 정보 생성 여부 */
  hasAdditionalBuyerInfo?: boolean
  /** 담보제공자와 동일한 채무자 수 */
  numberOfBuyersAsDebtors?: number
  /** 담보제공자와 무관한 채무자 수 */
  numberOfIndependentDebtors?: number
  /** 피담보채무의범위 포함 여부 */
  hasScopeOfSecuredDebt?: boolean
  /** 등기권리증 정보 생성 여부 */
  hasRegistryRightCertificate?: boolean
  /** 소유자 정보 포함 여부 */
  hasPropertyOwnerInfo?: boolean
  /** 부동산 권리 포함 여부 */
  hasPropertyRights?: boolean
}

export type CreateRegistryTypeComboTestDataResponse = RegistryProgressTestDataResponse

// ==================== Schemas ====================

/** 등기진행 테스트 데이터 응답 */
export interface RegistryProgressTestDataResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 기관ID */
  organizationId?: number
  /** 지점ID (null일 수 있음) */
  branchId?: number
  /** 담당자ID (null일 수 있음) */
  managerUserId?: number
  /** 업무구분 */
  workType?: 'ESTABLISHMENT' | 'TRANSFER_AND_ESTABLISHMENT'
  /** 업무구분 설명 */
  workTypeDescription?: string
  /** 등기의뢰일자 */
  registryRequestDate?: string
  /** 등기접수일자 */
  registryReceiptDate?: string
  /** 대출실행일자 */
  loanExecutionDate?: string
  /** 배정업무 */
  assignedWork?: string
  /** 진행상태 */
  progressStatus?:
    | 'ASSIGN_MANAGER'
    | 'INSPECT_REGISTRY_INFO'
    | 'REQUEST_RESUBMISSION'
    | 'REGISTER_APPLICATION_INFO'
    | 'REQUEST_ADMIN_INFO_CONSENT'
    | 'OBLIGOR_E_SIGNATURE'
    | 'OBLIGEE_E_SIGNATURE'
    | 'TAX_DECLARATION_AGENCY'
    | 'PURCHASE_HOUSING_BOND'
    | 'REGISTER_LOAN_ACCOUNT'
    | 'WAITING_LOAN_PAYMENT'
    | 'LOAN_PAYMENT_COMPLETED'
    | 'REGISTER_TRANSFER_CERTIFICATE'
    | 'CREATE_APPLICATION'
    | 'INTERNET_REGISTRY_E_SIGNATURE'
    | 'REQUEST_CASE_DELEGATION'
    | 'WAITING_CASE_DELEGATION'
    | 'CASE_DELEGATION_COMPLETED'
    | 'REGISTRY_RECEIVED'
    | 'CREATE_COST_STATEMENT'
    | 'REGISTER_COMPLETION_DOCUMENTS'
    | 'SUBMIT_COMPLETION_DOCUMENTS'
    | 'REGISTRY_COMPLETED'
    | 'REGISTRY_CANCELLED'
  /** 진행상태 설명 */
  progressStatusDescription?: string
  /** 상환말소주체 (null일 수 있음) */
  repaymentCancellationSubject?: string
  /** 생성일시 */
  createdAt?: string
}

/** 등기의뢰 테스트 데이터 응답 */
export interface RegistryRequestTestDataResponse {
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 의뢰금융기관코드 */
  requestBankCode?: string
  /** 업무구분 */
  workType?: string
  /** 등기접수일자 */
  registryReceiptDate?: string
  /** 대출실행일자 */
  loanExecutionDate?: string
  /** 금융기관명 */
  bankName?: string
  /** 지점명 */
  branchName?: string
  /** 담당자명 */
  managerName?: string
  /** 담당자직급 */
  managerPosition?: string
  /** 담당자전화번호 */
  managerPhone?: string
  /** 담당자전달사항 */
  managerMessage?: string
  /** 후행법무대리인명칭 */
  organizationName?: string
  /** 생성일시 */
  createdAt?: string
}
