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

export type GetDetailedApplicationAttachmentResponse = RegistryApplicationAttachmentResponse

/**
 * R02J-02
 * PUT /api/registry/applications/{applicationId}/attachments
 */
export interface ReplaceApplicationAttachmentsParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationAttachmentsRequest = RegistryApplicationAttachmentReplaceRequest

export type ReplaceApplicationAttachmentsResponse = RegistryApplicationAttachmentResponse

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
  attachmentName: 'CNT' | 'RGC' | 'RRC'
  /** 제출방식 */
  submissionMethod: 'ELECTRONIC_CREATE' | 'ELECTRONIC_UPLOAD' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
  /** 부가정보 (제출방식에 따라 필수) */
  additionalInfo?: string
  /** 통수 (제출방식에 따라 필수) */
  quantity?: number
  /** HTML양식 (제출방식에 따라 필수) */
  htmlForm?: string
  /** 임시파일명 (제출방식에 따라 필수) */
  tempFileName?: string
  /** 원용정보 (제출방식에 따라 필수) */
  referenceMethod?: 'NOT_APPLICABLE' | 'OFFICE_USE' | 'SIMULTANEOUS_SUBMIT' | 'PREVIOUS_ATTACHMENT'
}

/** 첨부서면 상세 정보 조회 */
export interface RegistryApplicationAttachmentItemResponse {
  /** 첨부서면ID */
  attachmentId?: number
  /** 첨부서면명칭 */
  attachmentName?: 'CNT' | 'RGC' | 'RRC'
  /** 제출방식 */
  submissionMethod?: 'ELECTRONIC_CREATE' | 'ELECTRONIC_UPLOAD' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
  /** 부가정보 */
  additionalInfo?: string
  /** 통수 */
  quantity?: number
  /** HTML양식 */
  htmlForm?: string
  /** 파일경로 */
  filePath?: string
  /** 원용정보 */
  referenceMethod?: 'NOT_APPLICABLE' | 'OFFICE_USE' | 'SIMULTANEOUS_SUBMIT' | 'PREVIOUS_ATTACHMENT'
}

export interface RegistryApplicationAttachmentReplaceRequest {
  /** 첨부서면 정보 목록 */
  attachmentItems: AttachmentReplaceItem[]
}

/** 첨부서면 정보 조회 */
export interface RegistryApplicationAttachmentResponse {
  /** 첨부서면 목록 */
  items?: RegistryApplicationAttachmentItemResponse[]
  /** 첨부서면 옵션 목록 */
  fileRequestDocumentTypeOptions?: string[]
  /** 제출방식 옵션 목록 */
  submissionMethodOptions?: string[]
  /** 원용정보 옵션 목록 */
  referenceMethodOptions?: string[]
}
