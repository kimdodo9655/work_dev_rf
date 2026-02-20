/**
 * REGISTRY_ADMIN_CONSENT API Types
 * @generated 2025-01-27
 */

import type { BranchRegistryCredentialResponse, PropertyInfo } from './common.types'

/**
 * R02N-01
 * GET /api/registry/progress/{registryManagementNumber}/admin-info-requests/list
 */
export interface GetApplicationAdminInfoRequestsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetApplicationAdminInfoRequestsResponse =
  RegistryApplicationAdminInfoRequestListResponse

/**
 * R02N-02
 * PATCH /api/registry/progress/{registryManagementNumber}/admin-info-requests
 */
export interface UpdateApplicationAdminInfoRequestsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type UpdateApplicationAdminInfoRequestsRequest = RegistryApplicationAdminInfoRequestRequest

export type UpdateApplicationAdminInfoRequestsResponse = RegistryApplicationAdminInfoRequestResponse

/**
 * R02N-03
 * GET /api/registry/progress/{registryManagementNumber}/admin-info-requests/detail
 */
export interface GetDetailedApplicationAdminInfoRequestsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetDetailedApplicationAdminInfoRequestsResponse =
  RegistryApplicationAdminInfoRequestResponse

// ==================== Schemas ====================

/** 행정정보사전동의서 정보 항목 */
export interface AdminInfoRequestItem {
  /** 신청서ID */
  applicationId: number
  /** 자격자ID */
  qualifiedId: number
  /** 작성년도 */
  creationYear: string
  /** 작성번호 */
  creationNumber: string
  /** 행정정보연계시점 */
  adminInfoLinkTime: 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'
  /** 작성ID */
  creationId: string
  /** 접수일자 */
  receiptDate: string
  /** 접수번호 */
  receiptNumber: string
  /** 작성원인 */
  creationCause: string
  /** 접수등기소 */
  receiptOffice: string
}

/** 행정정보사전동의요구서 목록 상세 정보 */
export interface ApplicationAdminInfoRequestListItem {
  /** 신청서ID */
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
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  /** 등기진행방식 */
  registryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 접수등기소 */
  registryReceiptOffice?: string
  /** 작성년도 */
  creationYear?: string
  /** 작성번호 */
  creationNumber?: string
  /** 행정정보사전동의서 ID */
  adminInfoRequestId?: number
}

/** 기본 정보 */
export interface BasicInfoItem {
  /** 신청서 ID */
  applicationId?: number
  /** 행정정보사전동의서 ID */
  adminInfoRequestId?: number
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
  /** 등기방식 */
  registryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 행정정보연계시점 */
  adminInfoLinkTime?: 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'
  /** 작성ID */
  creationId?: string
  /** 접수등기소 */
  registryReceiptOffice?: string
  /** 작성년도 */
  creationYear?: string
  /** 작성번호 */
  creationNumber?: string
  branchRegistryCredentials?: BranchRegistryCredentialResponse
}

/** 입력 정보 */
export interface InputInfoItem {
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기원인일자 */
  registryCauseDate?: string
  /** 부동산 정보 */
  properties?: PropertyInfo[]
  /** 접수등기소 정보 */
  registryReceiptOffice?: string
  /** 등기의무자 정보 */
  obligors?: PartyInfo[]
  /** 등기권리자 정보 */
  rightHolders?: PartyInfo[]
  /** 정보제공 동의 요청 문서 */
  requestDocumentType?: string
}

/** 당사자 정보 */
export interface PartyInfo {
  /** 당사자명 */
  name?: string
  /** 당사자 구분 */
  partyRole?: 'REGISTRY_OBLIGOR' | 'REGISTRY_OBLIGEE' | 'DEBTOR'
  /** 주민등록번호 */
  registrationNumber?: string
  /** 연락처 */
  contact?: string
}

/** 행정정보사전동의요구서 목록 조회 응답 */
export interface RegistryApplicationAdminInfoRequestListResponse {
  /** 행정정보사전동의요구서 목록 */
  applicationAdminInfoRequest?: ApplicationAdminInfoRequestListItem[]
}

export interface RegistryApplicationAdminInfoRequestRequest {
  /** 행정정보사전동의서 정보 목록 */
  adminInfoRequestItems: AdminInfoRequestItem[]
}

/** 행정정보사전동의요구서 상세 조회 정보 */
export interface RegistryApplicationAdminInfoRequestResponse {
  /** 행정정보사전동의요구서 정보 */
  adminInfoRequestItems?: BasicInfoItem[]
  /** 행정정보사전동의요구서 입력 정보 */
  adminInfoRequestInputItems?: InputInfoItem[]
}
