/**
 * REGISTRY_RECEIPT API Types
 * @generated 2025-01-27
 */

import type { BranchRegistryCredentialResponse } from './common.types'

/**
 * R02U-01
 * GET /api/registry/applications/{registryManagementNumber}/receipts/list
 */
export interface GetApplicationReceiptsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetApplicationReceiptsResponse = RegistryApplicationReceiptListResponse

/**
 * R02U-02
 * PATCH /api/registry/applications/{registryManagementNumber}/receipts
 */
export interface UpdateApplicationReceiptsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type UpdateApplicationReceiptsRequest = RegistryApplicationReceiptReplaceRequest

export type UpdateApplicationReceiptsResponse = RegistryApplicationReceiptResponse

/**
 * R02U-03
 * GET /api/registry/applications/{registryManagementNumber}/receipts/detail
 */
export interface GetDetailedApplicationReceiptsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetDetailedApplicationReceiptsResponse = RegistryApplicationReceiptResponse

// ==================== Schemas ====================

/** 등기 신청사건 조회 정보 - 등기 신청서 정보 */
export interface ApplicationReceiptItem {
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
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
}

/** 등기 접수 목록 상세 정보 */
export interface ApplicationReceiptListItem {
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기진행방식 */
  registryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 접수등기소 */
  registryReceiptOffice?: string
  /** 작성번호 */
  creationNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
}

/** 등기접수 정보 항목 */
export interface ReceiptItem {
  /** 신청서ID */
  applicationId: number
  /** 자격자ID */
  qualifiedId?: number
  /** 작성년도 */
  creationYear?: string
  /** 작성번호 */
  creationNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
}

/** 등기 접수 정보 목록 조회 응답 */
export interface RegistryApplicationReceiptListResponse {
  /** 등기접수 정보 목록 */
  applicationReceipt?: ApplicationReceiptListItem[]
}

export interface RegistryApplicationReceiptReplaceRequest {
  /** 등기접수 정보 목록 */
  receiptItems: ReceiptItem[]
}

/** 등기 접수 상세 조회 정보 */
export interface RegistryApplicationReceiptResponse {
  branchRegistryCredentials?: BranchRegistryCredentialResponse
  /** 등기 접수 정보 */
  applicationReceiptItems?: ApplicationReceiptItem[]
}
