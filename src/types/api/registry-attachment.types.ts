/**
 * 문서 경로: `@/src/types/api/registry-attachment.types.ts`
 * 문서 제목: 타입 정의: registry-attachment-types
 */

/**
 * REGISTRY_ATTACHMENT API Types
 * @generated 2025-01-27
 */

import type { DocumentDownloadBase64Response, DocumentUploadResponse } from './common.types'

export type AttachmentFileProgressDocumentType =
  | 'LST'
  | 'POA'
  | 'POAP'
  | 'SGN'
  | 'SGNP'
  | 'CRT'
  | 'CNT'
  | 'RFC'
  | 'RPC'
  | 'RRC'
  | 'TAX'
  | 'RLT'
  | 'RLTP'
  | 'SMP'
  | 'SMPP'
  | 'SVC'
  | 'SVCO'
  | 'ESC'
  | 'ESCO'
  | 'RRIO'
  | 'RRIE'
  | 'RRI'
  | 'LRIO'
  | 'LRIE'
  | 'LRI'
  | 'LRCO'
  | 'LRCE'
  | 'LRC'
  | 'CNF'
  | 'CNFO'
  | 'RPS'
  | 'LTP'
  | 'LBK'
  | 'GBK'
  | 'CBK'
  | 'CRP'
  | 'CRPO'
  | 'CRPE'
  | 'CSM'
  | 'ECS'
  | 'BSC'
  | 'FRC'
  | 'RFR'
  | 'RLS'
  | 'TRC'
  | 'TRCP'
  | 'DRW'
  | 'LPA'
  | 'RPA'

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

/**
 * R02J-04
 * GET /api/registry/applications/{applicationId}/attachments/docInfo
 */
export interface GetApplicationAttachmentDataQuery {
  fileProgressDocumentType: AttachmentFileProgressDocumentType
}

export interface GetApplicationAttachmentDataParams {
  applicationId: number
}

export type GetApplicationAttachmentDataResponse = AttachmentFormDocumentResponse

/**
 * R02J-05
 * PUT /api/registry/applications/{applicationId}/attachments/uploadTmp
 */
export interface UploadTmpApplicationAttachmentDataQuery {
  /** 파일명 코드 */
  fileProgressDocumentType: AttachmentFileProgressDocumentType
}

export interface UploadTmpApplicationAttachmentDataParams {
  /** 신청서ID */
  applicationId: number
}

export interface UploadTmpApplicationAttachmentDataRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadTmpApplicationAttachmentDataResponse = DocumentUploadResponse

// ==================== Schemas ====================

/** 첨부서면 정보 목록 */
export interface AttachmentReplaceItem {
  /** 첨부서면명칭 */
  attachmentName: AttachmentFileProgressDocumentType
  /** 제출방식 */
  submissionMethod: 'ELECTRONIC' | 'SCAN' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
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
  /** 노출 여부 */
  isExposed?: boolean
  /** 액션 */
  action?: 'ADD' | 'MODIFY' | 'DELETE'
}

export interface RegistryApplicationAttachmentReplaceRequest {
  /** 첨부서면 정보 목록 */
  attachmentItems: AttachmentReplaceItem[]
}

/** 원용정보 */
export interface ReferenceMethodItem {
  /** 원용 파일명 */
  filename?: string
}

/** 첨부서면 목록 */
export interface AttachmentItem {
  name?: string
  fileName?: string
  attachmentName?: AttachmentFileProgressDocumentType
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
  rentalBusinessRegistrationNumber?: string
  jurisdictionRegistryOffice?: string
  submissionMethod?: 'ELECTRONIC' | 'SCAN' | 'VISIT_SUBMIT' | 'ADMIN_INFO_LINK'
  submissionMethodOptions?: string[]
  referenceMethodOptions?: string[]
  partyNamesOptions?: string[]
  jurisdictionRegistryOfficeOptions?: string[]
  referenceMethod?: ReferenceMethodItem[]
  additionalInfo?: string
  isExposed?: boolean
  action?: string
}

/** 첨부서면 정보 조회 */
export interface RegistryApplicationAttachmentDetailResponse {
  /** 첨부서면 목록 */
  items?: AttachmentItem[]
  /** 첨부서면 명칭 옵션 목록 */
  fileProgressDocumentTypeOptions?: string[]
  /** 제출방식 옵션 목록 */
  submissionMethodOptions?: string[]
  /** 원용정보 옵션 목록 */
  referenceMethodOptions?: string[]
}

export interface ConsentPartyResponse {
  partyRole?: string
  partyType?: string
  ownershipType?: string
  name?: string
  registrationNumber?: string
  phoneNumber?: string
  nationality?: string
  email?: string
  address?: string
  addressDetail?: string
  share?: string
  holdingShare?: string
  transferShare?: string
  section?: string
  rankNumber?: string
  representativeType?: string
  representativePosition?: string
  representativeName?: string
  representativeNationality?: string
  rentalBusinessRegistrationNumber?: string
}

export interface ConfirmationInfoResponse {
  confirmationDocumentType?: string
  specialNote?: string
}

export interface AttachmentFormDocumentResponse {
  attachmentName?: string
  propertyDescription?: string[]
  transactionAmount?: string
  acceptanceOfficeName?: string
  jurisdictionOfficeName?: string
  registryCause?: string
  registryPurpose?: string
  shareDescription?: string
  cancellationContent?: string
  registryCauseDate?: string
  registryReceiptDate?: string
  consentParties?: ConsentPartyResponse[]
  agentInfo?: {
    lawFirmName?: string
    qualificationType?: string
    qualifiedPersonName?: string
    phoneNumber?: string
    extensionNumber?: string
    address?: string
  }
  confirmationInfos?: ConfirmationInfoResponse[]
}
