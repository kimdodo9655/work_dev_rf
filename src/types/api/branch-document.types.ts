/**
 * BRANCH_DOCUMENT API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  DocumentDownloadBase64Response,
  DocumentListResponse,
  DocumentSaveRequest,
  DocumentSaveResponse,
  DocumentUploadResponse
} from './common.types'

/**
 * P02F-01
 * POST /api/organizations/{organizationId}/branches/{branchId}/documents/temp
 */
export interface UploadToTempQuery {
  /** 문서 종류 (BLF: 사업자등록증, ICF: 보험가입증명서) */
  documentType: string
}

export interface UploadToTempParams {
  /** 기관 ID (미정시 0) */
  organizationId: number
  /** 지점 ID (미정시 0) */
  branchId: number
}

export interface UploadToTempRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadToTempResponse = DocumentUploadResponse

/**
 * P02F-02
 * GET /api/organizations/{organizationId}/branches/{branchId}/documents
 */
export interface GetDocumentsParams {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
}

export type GetDocumentsResponse = DocumentListResponse

/**
 * P02F-03
 * POST /api/organizations/{organizationId}/branches/{branchId}/documents
 */
export interface SaveDocumentParams {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
}

export type SaveDocumentRequest = DocumentSaveRequest

export type SaveDocumentResponse = DocumentSaveResponse

/**
 * P02F-04
 * DELETE /api/organizations/{organizationId}/branches/{branchId}/documents
 */
export interface DeleteDocumentQuery {
  /** 파일명 */
  fileName: string
}

export interface DeleteDocumentParams {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
}

export type DeleteDocumentResponse = ApiResultVoid

/**
 * P02F-05
 * GET /api/organizations/{organizationId}/branches/{branchId}/documents/download
 */
export interface DownloadDocumentQuery {
  /** 파일명 */
  fileName: string
}

export interface DownloadDocumentParams {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
}

export type DownloadDocumentResponse = Blob

/**
 * P02F-06
 * GET /api/organizations/{organizationId}/branches/{branchId}/documents/download/base64
 */
export interface DownloadDocumentAsBase64Query {
  /** 파일명 */
  fileName: string
}

export interface DownloadDocumentAsBase64Params {
  /** 기관 ID */
  organizationId: number
  /** 지점 ID */
  branchId: number
}

export type DownloadDocumentAsBase64Response = DocumentDownloadBase64Response
