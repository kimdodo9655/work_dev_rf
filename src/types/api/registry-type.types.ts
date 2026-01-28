/**
 * REGISTRY_TYPE API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid, RegistryMethod } from './common.types'

/**
 * R02D-02
 * POST /api/registry/applications
 */
export type CreateRegistryApplicationRequest = RegistryApplicationCreateRequest

export type CreateRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-03
 * DELETE /api/registry/applications/{applicationId}
 */
export interface DeleteRegistryApplicationParams {
  /** 신청서ID */
  applicationId: number
}

export type DeleteRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-04
 * PATCH /api/registry/applications/{applicationId}
 */
export interface UpdateRegistryApplicationParams {
  /** 신청서ID */
  applicationId: number
}

export type UpdateRegistryApplicationRequest = RegistryApplicationUpdateRequest

export type UpdateRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-08
 * GET /api/registry/applications/tabs
 */
export interface GetRegistryApplicationFormsQuery {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryApplicationFormsResponse = RegistryApplicationFormResponse

/**
 * R02D-09
 * GET /api/registry/applications/{applicationId}/documents
 */
export interface GetApplicationDocumentsParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetApplicationDocumentsResponse = RegistryApplicationDocumentResponse

// ==================== Schemas ====================

/** 행정정보 연계 시점 */
export type AdminInfoLinkTime = 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'

export interface RegistryApplicationCreateRequest {
  /** 등기 관리번호 */
  registryManagementNumber: string
  registryType: RegistryType
  registryCause: RegistryCause
  registryMethod: RegistryMethod
  adminInfoLinkTime: AdminInfoLinkTime
}

/** 등기신청서 전자문서 응답 */
export interface RegistryApplicationDocumentResponse {
  /** 신청서 ID */
  applicationId?: number
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
  /** 등기방식 */
  registryMethod?: string
  /** 행정정보 연계 시점 */
  adminInfoLinkTime?: string
  /** 등기유형별 섹션 목록 */
  sections?: RegistryApplicationDocumentSectionResponse[]
}

/** 등기신청서 전자문서 섹션 정보 */
export interface RegistryApplicationDocumentSectionResponse {
  /** 섹션 코드 */
  code?: string
  /** 섹션 제목 */
  title?: string
}

export interface RegistryApplicationFormResponse {
  applicationId?: number
  registryManagementNumber?: string
  dataSource?: 'REQUEST' | 'MANUAL'
  registryType?: string
  registryTypeLabel?: string
}

export interface RegistryApplicationUpdateRequest {
  registryMethod: RegistryMethod
  adminInfoLinkTime: AdminInfoLinkTime
}

/** 등기 원인 */
export type RegistryCause =
  | 'TRADE'
  | 'ESTABLISHMENT_CONTRACT'
  | 'ADDRESS_CHANGE'
  | 'ROAD_NAME_ADDRESS'
  | 'APPLICATION_ERROR'
  | 'TERMINATION'

/** 등기 유형 */
export type RegistryType =
  | 'OWNERSHIP_TRANSFER'
  | 'MORTGAGE'
  | 'SURFACE_RIGHT'
  | 'CHANGE'
  | 'CORRECTION'
  | 'MORTGAGE_CANCELLATION'
  | 'SURFACE_RIGHT_CANCELLATION'
