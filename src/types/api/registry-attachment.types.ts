/**
 * 문서 경로: `@/src/types/api/registry-attachment.types.ts`
 * 문서 제목: 타입 정의: registry-attachment-types
 */

/**
 * REGISTRY_ATTACHMENT API Types
 * @generated 2025-01-27
 */

import type { DocumentDownloadBase64Response } from './common.types'

/**
 * R02J-01
 * GET /api/registry/applications/{applicationId}/attachments
 */
export interface GetDetailedApplicationAttachmentParams {
  /** 신청서ID */
  applicationId: number
}

export type GetDetailedApplicationAttachmentResponse = RegistryApplicationAttachmentDetailResponse

/**
 * R02J-02
 * PUT /api/registry/applications/{applicationId}/attachments
 */
export interface ReplaceApplicationAttachmentsParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationAttachmentsRequest = RegistryApplicationAttachmentReplaceRequest

export type ReplaceApplicationAttachmentsResponse = RegistryApplicationAttachmentDetailResponse

/**
 * R02J-03
 * GET /api/registry/applications/{applicationId}/attachments/download
 */
export interface DownloadApplicationAttachmentQuery {
  /** 파일명 */
  fileName: string
}

export interface DownloadApplicationAttachmentParams {
  /** 신청서ID */
  applicationId: number
}

export type DownloadApplicationAttachmentResponse = Blob

/**
 * R02J-04
 * GET /api/registry/applications/{applicationId}/attachments/preview
 */
export interface ViewRegistryApplicationAttachmentQuery {
  /** 파일명 */
  fileName: string
}

export interface ViewRegistryApplicationAttachmentParams {
  /** 신청서ID */
  applicationId: number
}

export type ViewRegistryApplicationAttachmentResponse = DocumentDownloadBase64Response

// ==================== Schemas ====================

/** 첨부서면 정보 목록 */
export interface AttachmentReplaceItem {
  /** 첨부서면명칭 */
  attachmentName:
    | 'LST'
    | 'POA'
    | 'SGN'
    | 'CRT'
    | 'CNT'
    | 'RFC'
    | 'RPC'
    | 'RRC'
    | 'TAX'
    | 'SMP'
    | 'SVC'
    | 'ESC'
    | 'RRI'
    | 'LRI'
    | 'LRC'
    | 'CNF'
    | 'RPS'
    | 'LTP'
    | 'LBK'
    | 'GBK'
    | 'CBK'
    | 'LPA'
    | 'RPA'
    | 'CRP'
    | 'CSM'
    | 'ECS'
  /** 제출방식 */
  submissionMethod: 'ELECTRONIC_CREATE' | 'ELECTRONIC_UPLOAD' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
  /** 부가정보 (제출방식에 따라 필수) */
  additionalInfo?: string
  /** 통수 (제출방식에 따라 필수) */
  quantity?: number
  /** 임시파일명 (제출방식에 따라 필수) */
  fileName?: string
  /** 원용정보 (제출방식에 따라 필수) */
  referenceMethod?: 'NOT_APPLICABLE' | 'OFFICE_USE' | 'SIMULTANEOUS_SUBMIT' | 'PREVIOUS_ATTACHMENT'
  /** 동의인 */
  name?: string
  /** 관할등기소 */
  jurisdictionRegistryOffice?: string
  /** 임대사업자등록번호 */
  rentalBusinessRegistrationNumber?: string
}

export interface RegistryApplicationAttachmentReplaceRequest {
  /** 첨부서면 정보 목록 */
  attachmentItems: AttachmentReplaceItem[]
}

/** 첨부서면 목록 */
export interface AttachmentItemProjection {
  name?: string
  fileName?: string
  attachmentName?:
    | 'LST'
    | 'POA'
    | 'SGN'
    | 'CRT'
    | 'CNT'
    | 'RFC'
    | 'RPC'
    | 'RRC'
    | 'TAX'
    | 'SMP'
    | 'SVC'
    | 'ESC'
    | 'RRI'
    | 'LRI'
    | 'LRC'
    | 'CNF'
    | 'RPS'
    | 'LTP'
    | 'LBK'
    | 'GBK'
    | 'CBK'
    | 'LPA'
    | 'RPA'
    | 'CRP'
    | 'CSM'
    | 'ECS'
  registryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  quantity?: number
  jurisdictionRegistryOffice?: string
  submissionMethod?: 'ELECTRONIC_CREATE' | 'ELECTRONIC_UPLOAD' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
  referenceMethod?: 'NOT_APPLICABLE' | 'OFFICE_USE' | 'SIMULTANEOUS_SUBMIT' | 'PREVIOUS_ATTACHMENT'
  additionalInfo?: string
  rentalBusinessRegistrationNumber?: string
}

/** 첨부서면 정보 조회 */
export interface RegistryApplicationAttachmentDetailResponse {
  /** 첨부서면 목록 */
  items?: AttachmentItemProjection[]
  /** 첨부서면 명칭 옵션 목록 */
  fileProgressDocumentTypeOptions?: string[]
  /** 제출방식 옵션 목록 */
  submissionMethodOptions?: string[]
  /** 원용정보 옵션 목록 */
  referenceMethodOptions?: string[]
  /** 동의인 옵션 목록 */
  partyNamesOptions?: string[]
  /** 관할등기소 옵션 목록 */
  jurisdictionRegistryOfficeOptions?: string[]
}
