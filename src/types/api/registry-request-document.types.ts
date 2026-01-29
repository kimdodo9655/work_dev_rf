/**
 * REGISTRY_REQUEST_DOCUMENT API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  DocumentDownloadBase64Response,
  DocumentListResponse,
  DocumentSaveResponse
} from './common.types'

/**
 * R00D-01
 * GET /api/registry/requests/{requestNumber}/documents
 */
export interface GetDocuments_1Params {
  /** 등기 의뢰 번호 */
  requestNumber: string
}

export type GetDocuments_1Response = DocumentListResponse

/**
 * R00D-02
 * POST /api/registry/requests/{requestNumber}/documents
 */
export interface UploadDocumentQuery {
  /** 등기 유형 (계약서인 경우 필수) */
  registryType?: string
  /** 문서 종류 (CNT: 계약서, RGC: 등기권리증, RRC: 주민등록초본) */
  documentType: string
  /** 순번 (등기권리증/주민등록초본인 경우 필수) */
  sequence?: number
  /** 백업 여부 */
  backup: boolean
}

export interface UploadDocumentParams {
  /** 등기 의뢰 번호 */
  requestNumber: string
}

export interface UploadDocumentRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadDocumentResponse = DocumentSaveResponse

/**
 * R00D-03
 * GET /api/registry/requests/{requestNumber}/documents/{fileName}
 */
export interface DownloadDocument_1Params {
  /** 등기 의뢰 번호 */
  requestNumber: string
  /** 파일명 */
  fileName: string
}

export type DownloadDocument_1Response = Blob

/**
 * R00D-04
 * DELETE /api/registry/requests/{requestNumber}/documents/{fileName}
 */
export interface DeleteDocument_1Params {
  /** 등기 의뢰 번호 */
  requestNumber: string
  /** 파일명 */
  fileName: string
}

export type DeleteDocument_1Response = ApiResultVoid

/**
 * R00D-05
 * GET /api/registry/requests/{requestNumber}/documents/{fileName}/base64
 */
export interface DownloadDocumentAsBase64_1Params {
  /** 등기 의뢰 번호 */
  requestNumber: string
  /** 파일명 */
  fileName: string
}

export type DownloadDocumentAsBase64_1Response = DocumentDownloadBase64Response
