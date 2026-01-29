/**
 * RPA API Types
 * @generated 2025-01-28
 */

import type { ApiResultVoid } from './common.types'

/**
 * RPAC-01
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-view
 */
export interface CreateFullCertificateViewTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateFullCertificateViewTaskRequest = FullCertificateTaskRequest

export type CreateFullCertificateViewTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-02
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/property-description
 */
export interface CreatePropertyDescriptionTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreatePropertyDescriptionTaskRequest = PropertyDescriptionTaskRequest

export type CreatePropertyDescriptionTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-03
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-password
 */
export interface CreateRegistrationPasswordTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateRegistrationPasswordTaskRequest = RegistrationPasswordTaskRequest

export type CreateRegistrationPasswordTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-04
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-acquisition
 */
export interface CreateEtaxAcquisitionTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateEtaxAcquisitionTaskRequest = EtaxAcquisitionTaskRequest

export type CreateEtaxAcquisitionTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-05
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-registration
 */
export interface CreateEtaxRegistrationTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateEtaxRegistrationTaskRequest = EtaxRegistrationTaskRequest

export type CreateEtaxRegistrationTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-06
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-acquisition
 */
export interface CreateWetaxAcquisitionTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateWetaxAcquisitionTaskRequest = WetaxAcquisitionTaskRequest

export type CreateWetaxAcquisitionTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-07
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-registration
 */
export interface CreateWetaxRegistrationTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateWetaxRegistrationTaskRequest = WetaxRegistrationTaskRequest

export type CreateWetaxRegistrationTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-08
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-case
 */
export interface CreateRegistrationCaseQueryTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateRegistrationCaseQueryTaskRequest = RegistrationCaseQueryTaskRequest

export type CreateRegistrationCaseQueryTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-09
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/admin-consent
 */
export interface CreateAdminConsentTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateAdminConsentTaskRequest = AdminConsentTaskRequest

export type CreateAdminConsentTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-10
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-application
 */
export interface CreateRegistrationApplicationTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateRegistrationApplicationTaskRequest = RegistrationApplicationTaskRequest

export type CreateRegistrationApplicationTaskResponse = RpaUserTaskCreateResponse

/**
 * RPAC-11
 * GET /api/registry/rpa/user-tasks/{taskToken}
 */
export interface GetTaskParams {
  /** RPA 작업 토큰 (UUID) */
  taskToken: string
}

export type GetTaskResponse = RpaUserTaskResponse

/**
 * RPAC-12
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/ownership-tax
 */
export interface CreateOwnershipTaxTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateOwnershipTaxTaskRequest = TaxAutoFillTaskRequest

export type CreateOwnershipTaxTaskResponse = RpaUserTaskCreateResponse

// operationId 매칭을 위한 alias
export type CreateTaxAutoFillTaskParams = CreateOwnershipTaxTaskParams
export type CreateTaxAutoFillTaskRequest = CreateOwnershipTaxTaskRequest
export type CreateTaxAutoFillTaskResponse = CreateOwnershipTaxTaskResponse

/**
 * RPAC-12
 * PATCH /api/registry/rpa/user-tasks/{taskToken}/result
 */
export interface SubmitResultParams {
  /** RPA 작업 토큰 (UUID) */
  taskToken: string
}

export type SubmitResultRequest = RpaUserTaskResultRequest

export type SubmitResultResponse = ApiResultVoid

/**
 * RPAC-13
 * POST /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate-issue
 */
export interface CreateFullCertificateIssueTaskParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type CreateFullCertificateIssueTaskRequest = FullCertificateTaskRequest

export type CreateFullCertificateIssueTaskResponse = RpaUserTaskCreateResponse

// ==================== Schemas ====================

/** 행정정보 동의요청 작업 요청 */
export interface AdminConsentTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/** 이택스 취득세 작업 요청 */
export interface EtaxAcquisitionTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/** 이택스 등록면허세 작업 요청 */
export interface EtaxRegistrationTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/** 등기사항전부증명서 열람/발급 작업 요청 */
export interface FullCertificateTaskRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 카드 번호 */
  cardNumber: string
}

/** 세금신고 자동 작성 작업 요청 */
export interface TaxAutoFillTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/** 부동산의표시 생성 작업 요청 */
export interface PropertyDescriptionTaskRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
}

/** 등기신청서 작성 작업 요청 */
export interface RegistrationApplicationTaskRequest {
  /** 신청서 ID */
  applicationId: number
  /** 부동산 ID */
  propertyId: number
}

/** 등기 신청사건 조회 작업 요청 */
export interface RegistrationCaseQueryTaskRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 신청인고유ID */
  progressPartyId: number
}

/** 등기필정보 비밀번호 조회 작업 요청 */
export interface RegistrationPasswordTaskRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기권리증 일련번호 */
  certificateSerialNumber: string
}

/** RPA 사용자 PC 작업 생성 응답 */
export interface RpaUserTaskCreateResponse {
  /** 작업 ID */
  taskId?: number
  /** 작업 토큰 (UUID) */
  taskToken?: string
  /** 작업 종류 */
  taskType?: string
  /** 작업 상태 */
  taskStatus?: string
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 생성 일시 */
  createdAt?: string
}

/** RPA 사용자 PC 작업 조회 응답 */
export interface RpaUserTaskResponse {
  /** 작업 토큰 (UUID) */
  taskToken?: string
  /** 작업 종류 */
  taskType?: string
  /** 작업 상태 */
  taskStatus?: string
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 작업 입력 데이터 */
  taskData?: Record<string, Record<string, any>>
}

/** RPA 사용자 PC 작업 결과 전달 요청 */
export interface RpaUserTaskResultRequest {
  /** 작업 상태 (SUCCESS 또는 FAILED) */
  taskStatus: 'PENDING' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED' | 'SUCCESS' | 'FAILED'
  /** 작업 결과 데이터 (성공 시 결과, 실패 시 에러 정보) */
  resultData?: Record<string, Record<string, any>>
}

/** 위택스 취득세 작업 요청 */
export interface WetaxAcquisitionTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/** 위택스 등록면허세 작업 요청 */
export interface WetaxRegistrationTaskRequest {
  /** 신청서 ID */
  applicationId: number
}
