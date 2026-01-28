/**
 * REGISTRY_PROGRESS_DOCUMENT API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  DocumentDownloadBase64Response,
  DocumentSaveRequest,
  DocumentSaveResponse,
  DocumentUploadResponse
} from './common.types'

/**
 * R02Y-01
 * POST /api/registry/progress/{registryManagementNumber}/documents/temp
 */
export interface UploadToTemp_1Query {
  /** 등기 유형 (OT: 소유권이전, MR: 근저당권설정, SR: 지상권설정, CH: 변경, CO: 경정, CN: 말소) */
  registryType: string
  /** 문서 종류 (POA: 위임장, LST: 등기목록, SGN: 서명문, CRT: 인증서, CNT: 계약서) */
  documentType: string
  /** 신청번호 (필수) */
  applicationId: number
}

export interface UploadToTemp_1Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export interface UploadToTemp_1Request {
  /** 업로드할 파일 */
  file: string
}

export type UploadToTemp_1Response = DocumentUploadResponse

/**
 * R02Y-02
 * GET /api/registry/progress/{registryManagementNumber}/documents
 */
export interface GetDocuments_2Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetDocuments_2Response = RegistryProgressDocumentListResponse

/**
 * R02Y-03
 * POST /api/registry/progress/{registryManagementNumber}/documents
 */
export interface SaveDocument_1Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type SaveDocument_1Request = DocumentSaveRequest

export type SaveDocument_1Response = DocumentSaveResponse

/**
 * R02Y-04
 * DELETE /api/registry/progress/{registryManagementNumber}/documents
 */
export interface DeleteDocument_3Query {
  /** 파일명 */
  fileName: string
}

export interface DeleteDocument_3Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type DeleteDocument_3Response = ApiResultVoid

/**
 * R02Y-05
 * GET /api/registry/progress/{registryManagementNumber}/documents/download
 */
export interface DownloadDocument_2Query {
  /** 파일명 */
  fileName: string
}

export interface DownloadDocument_2Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

/**
 * R02Y-06
 * GET /api/registry/progress/{registryManagementNumber}/documents/download/base64
 */
export interface DownloadDocumentAsBase64_2Query {
  /** 파일명 */
  fileName: string
}

export interface DownloadDocumentAsBase64_2Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type DownloadDocumentAsBase64_2Response = DocumentDownloadBase64Response

/**
 * R02Y-07
 * DELETE /api/registry/progress/{registryManagementNumber}/applications/{applicationId}/documents
 */
export interface DeleteDocument_4Params {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 신청번호 */
  applicationId: number
}

export type DeleteDocument_4Response = ApiResultVoid

// ==================== Schemas ====================

/** 등기진행 문서 목록 응답 */
export interface RegistryProgressDocumentListResponse {
  /** 등기 유형 */
  registryType?: string
  /** 등기 유형명 */
  registryTypeName?: string
  /** 문서 종류 */
  documentType?: string
  /** 문서 종류명 */
  documentTypeName?: string
  /** 신청서 ID */
  applicationId?: number
  /** 파일명 */
  fileName?: string
  /** 파일 경로 */
  filePath?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
  /** 서명 필요 여부 */
  signatureRequired?: boolean
  /** 업로드일시 */
  uploadedAt?: string
}
