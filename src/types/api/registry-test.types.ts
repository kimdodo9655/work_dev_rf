/**
 * REGISTRY_TEST API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid } from './common.types'

/**
 * R00-01
 * POST /api/registry/requests/test-data
 */
export interface CreateRegistryRequestTestDataQuery {
  /** 후행법무대리인명칭 (Organization 테이블의 organization_name 값) */
  organizationName?: string
}

export type CreateRegistryRequestTestDataResponse = RegistryRequestTestDataResponse

/**
 * R00-02
 * POST /api/registry/progress/test-data
 */
export interface CreateRegistryProgressTestDataQuery {
  /** 등기신청번호 (등기의뢰 테스트 데이터 생성 API로 먼저 생성 필요) */
  registryRequestNumber: string
}

export type CreateRegistryProgressTestDataResponse = RegistryProgressTestDataResponse

/**
 * R00-03
 * POST /api/registry/scheduler/test-data/generate
 */
export type RunRegistryTestDataSchedulersResponse = ApiResultVoid

/**
 * R00-04
 * POST /api/registry/scheduler/test-data/generate-missing-progress
 */
export type RunGenerateMissingRegistryProgressDataSchedulerResponse = ApiResultVoid

/**
 * R00-05
 * POST /api/registry/scheduler/test-data/assign-managers
 */
export type RunRegistryManagerAssignmentSchedulerResponse = ApiResultVoid

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
  workType?: string
  /** 등기의뢰일자 */
  registryRequestDate?: string
  /** 등기접수일자 */
  registryReceiptDate?: string
  /** 대출실행일자 */
  loanExecutionDate?: string
  /** 배정업무 */
  assignedWork?: string
  /** 진행상태 */
  progressStatus?: string
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
